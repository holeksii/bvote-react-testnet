import { useState } from "react";
import { useEffect } from "react";
import { useTonClient } from "../hooks/useTonClient";
import { Organization } from "../sdk/wrappers/Organization";
import {
  Repository,
  storeDeployOrganizationWithMetadata,
} from "../sdk/wrappers/Repository";
import { beginCell, toNano } from "@ton/core";
import {
  SendTransactionRequest,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import Box from "../components/Page/Box";
import { Link, useNavigate } from "react-router-dom";
import FormsCustom from "../components/Forms/Custom";
import Overlay from "../components/Page/Overlay";
import { newOrganizationFields } from "../components/Forms/Fields";
import { repoId } from "../constants";

const pageSize = 5;

export default () => {
  const navigate = useNavigate();
  // ton stuff
  const tonClient = useTonClient();
  const [tonConnectUi] = useTonConnectUI();
  const wallet = useTonWallet();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(true);

  const [organizations, setOrganizations] = useState([] as any[]);

  let [total, setTotal] = useState(0n);
  let [totalLoaded, setTotalLoaded] = useState(0n);

  // org deployment
  const [overlayVisible, setOverlayVisible] = useState(false);

  async function loadMore() {
    if (tonClient === undefined) return;
    setIsUpdating(true);

    const mainRepo = await Repository.fromInit(repoId);
    const left = Number(total - totalLoaded);

    let newOrganizaions = await Promise.all(
      Array.from({
        length: Math.min(pageSize, left),
      }).map(async (_, index) => {
        const i = BigInt(index) + totalLoaded;
        const i_reverse = total - i - 1n;
        const organization = await Organization.fromAddress(
          await mainRepo.getOrganizationAddress(
            tonClient.provider(mainRepo.address),
            i,
          ),
        );
        try {
          const metadata = await organization.getMetadata(
            tonClient.provider(organization.address),
          );
          return {
            address: organization.address.toString(),
            metadata,
          };
        } catch (e) {
          // happend when organization is not yet deployed.
          return null;
        }
      }),
    );

    // add total loaded
    setTotalLoaded(totalLoaded + BigInt(newOrganizaions.length));

    // remove nulls
    newOrganizaions = newOrganizaions.filter((org) => org !== null);

    setOrganizations([...organizations, ...newOrganizaions]);
    setIsLoaded(true);
    setIsUpdating(false);
  }

  async function fetchBlockchain() {
    if (tonClient === undefined) return;
    setIsLoaded(false);

    const mainRepo = await Repository.fromInit(repoId);

    const n = await mainRepo.getNumOfOrganizations(
      tonClient.provider(mainRepo.address),
    );

    setTotal(n);
    total = n;

    setOrganizations([]);
    organizations.length = 0;

    setTotalLoaded(0n);
    totalLoaded = 0n;

    await loadMore();
  }

  async function deployOrganization(data: any) {
    if (!tonClient) return;
    setOverlayVisible(false);

    const repo = await Repository.fromInit(repoId);

    const deployFee = await repo.getDeployOrganizationFeePlusTonToLive(
      tonClient.provider(repo.address),
    );

    const tx: SendTransactionRequest = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          address: repo.address.toRawString(),
          amount: (deployFee + toNano(0.1)).toString(),
          payload: beginCell()
            .store(
              storeDeployOrganizationWithMetadata({
                $$type: "DeployOrganizationWithMetadata",
                metadata: {
                  $$type: "Metadata",
                  name: data.name,
                  description: data.description,
                  emoji: data.emoji,
                  website: data.website,
                },
              }),
            )
            .endCell()
            .toBoc()
            .toString("base64"),
        },
      ],
    };

    const res = await tonConnectUi.sendTransaction(tx);
  }

  // on mounted
  useEffect(() => {
    fetchBlockchain().catch((error) => {
      fetchBlockchain().catch((error) => {
        navigate("/error");
      });
    });
  }, [tonClient]);

  return (
    <div className="p-2">
      <button
        className="bg-slate-900 text-white px-4 py-2 rounded-xl mb-4"
        onClick={() => {
          // if no wallet then ask
          if (!wallet) tonConnectUi.openModal();
          else setOverlayVisible(true);
        }}
      >
        Create Organization
      </button>
      <Overlay isOpen={overlayVisible} onClose={() => setOverlayVisible(false)}>
        <div className="text-xl mb-2">Deploy Organization</div>
        <FormsCustom
          fields={newOrganizationFields}
          onFormSubmit={deployOrganization}
        />
      </Overlay>

      <div className="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 gap-4">
        {organizations.map((organization) => (
          <Link
            key={organization.address}
            to={`/organization?a=${organization.address}`}
          >
            <Box hover={true}>
              <div className="flex flex-col gap-2 ">
                <div className="flex w-full items-center justify-center">
                  <div className="rounded-full text-3xl bg-gray-300 w-14 h-14 mr-2 flex items-center overflow-hidden justify-center">
                    {organization.metadata.emoji}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-lg w-full truncate text-center">
                    {organization.metadata.name}
                  </div>
                  <div className="text-sm w-full truncate text-center font-mono">
                    {organization.address}
                  </div>
                </div>
              </div>
            </Box>
          </Link>
        ))}
        {!isLoaded &&
          Array(pageSize)
            .fill(0)
            .map((_, index) => (
              <Box hover={false} className="animate-pulse" key={index}>
                <div className="flex flex-col gap-2">
                  <div className="flex w-full items-center justify-center">
                    <div className="rounded-full text-3xl bg-gray-300 w-14 h-14 mr-2 flex items-center overflow-hidden justify-center"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-lg w-full truncate text-center flex justify-center">
                      <div className="h-6 bg-slate-800 w-1/2"></div>
                    </div>
                    <div className="text-sm w-full truncate text-center font-mono">
                      <div className="h-6 bg-slate-800 w-full"></div>
                    </div>
                  </div>
                </div>
              </Box>
            ))}
      </div>
      <div className="flex justify-center mt-4">
        {totalLoaded < total && isLoaded && (
          <button
            className={
              "bg-slate-900 text-white px-4 py-2 rounded-xl " +
              (isUpdating ? "cursor-not-allowed animate-pulse" : "")
            }
            onClick={() => {
              !isUpdating && loadMore();
            }}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};
