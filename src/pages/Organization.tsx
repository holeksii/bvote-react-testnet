import { Link } from "react-router-dom";
import { Key, useState } from "react";
import { useEffect } from "react";
import { useTonClient } from "../hooks/useTonClient";
import { useNavigate } from "react-router-dom";
import {
  Metadata,
  Organization,
  OrganizationAllInfo,
  storeDeployVotingWithMetadata,
  storeTransferOwnership,
  storeUpdateOrganizationInfo,
  storeWithdraw,
} from "../sdk/wrappers/Organization";
import { Voting } from "../sdk/wrappers/Voting";
import { Address, beginCell, fromNano, toNano } from "@ton/core";
import Box from "../components/Page/Box";
import InfoTable from "../components/Page/InfoTable";
import {
  SendTransactionRequest,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import FormsCustom from "../components/Forms/Custom";
import Overlay from "../components/Page/Overlay";
import { NewCandidateArray } from "../sdk/wrappers/Arrays";
import {
  getWithdrawFields,
  newVotingFields,
  getEditOrganizationFields,
  transferOwnershipFields,
} from "../components/Forms/Fields";
import EditSvg from "../components/Svg/Edit";

const pageSize = 4;

export default () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const contractAddress = params.get("a");

  const tonClient = useTonClient();
  const [tonConnectUi] = useTonConnectUI();
  const wallet = useTonWallet();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(true);

  const [votings, setVotings] = useState([] as any[]);

  const [metadata, setMetadata] = useState({} as Metadata);
  const [organizationInfo, setOrganizationInfo] = useState(
    {} as OrganizationAllInfo,
  );

  const [contractBalance, setContractBalance] = useState(0n);

  let [total, setTotal] = useState(0n);
  let [totalLoaded, setTotalLoaded] = useState(0n);

  const [createVotingOverlayVisible, setCreateVotingOverlayVisible] =
    useState(false);
  const [withdrawOverlayVisible, setWithdrawOverlayVisible] = useState(false);
  const [editOrganizationOverlayVisible, setEditOrganizationOverlayVisible] =
    useState(false);
  
  const [transgerOwnershipOverlayVisible, setTransgerOwnershipOverlayVisible] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  function allInfo() {
    const fields = {
      Owner: {
        type: "address",
        value: organizationInfo.owner.toString(),
      },
      Contract: {
        type: "address",
        value: contractAddress,
      },
      "Number of Votings": {
        type: "string",
        value: organizationInfo.numOfVotings.toString(),
      },
    } as any;

    if (metadata.website !== "") {
      fields["Website"] = {
        type: "url",
        value: metadata.website,
      };
    }

    // if owner is me add deploy voting fee
    if (isMyOrganization()) {
      fields["Contract Balance"] = {
        type: "string",
        value: fromNano(contractBalance).toString() + " TON",
      };
    }

    return fields;
  }

  function isMyOrganization() {
    if (!wallet) return false;
    if (!organizationInfo.owner) return false;
    return wallet?.account.address === organizationInfo.owner.toRawString();
  }

  async function loadMore() {
    if (tonClient === undefined) return;
    setIsUpdating(true);

    const provider = tonClient.provider(Address.parse(contractAddress!));
    const organization = provider.open(
      Organization.fromAddress(Address.parse(contractAddress!)),
    );

    // calculate based on how many left
    const left = Number(total - totalLoaded);

    let newVotings = await Promise.all(
      Array.from({
        length: Math.min(pageSize, left),
      }).map(async (_, index) => {
        const i = BigInt(index) + totalLoaded;
        const i_reverse = total - i - 1n;
        const vote = await Voting.fromAddress(
          await organization.getVotingAddress(i_reverse),
        );

        try {
          const info = await vote.getAllInfo(tonClient.provider(vote.address));

          return {
            address: vote.address.toString(),
            info,
          };
        } catch (e) {
          return null;
        }
      }),
    );

    // add total loaded
    setTotalLoaded(totalLoaded + BigInt(newVotings.length));

    // remove nulls (not yet deployed votings)
    newVotings = newVotings.filter((org) => org !== null);

    setVotings([...votings, ...newVotings]);
    setIsLoaded(true);
    setIsUpdating(false);
  }

  async function fetchBlockchain() {
    if (tonClient === undefined) return;

    const provider = tonClient.provider(Address.parse(contractAddress!));
    const organization = provider.open(
      Organization.fromAddress(Address.parse(contractAddress!)),
    );

    const numOfVotings = await organization.getNumOfVotings();
    const metadata = await organization.getMetadata();
    const info = await organization.getAllInfo();

    const contractBalance = await tonClient.getBalance(
      Address.parse(contractAddress!),
    );

    setContractBalance(contractBalance);

    // set
    setMetadata(metadata);
    setOrganizationInfo(info);

    setTotal(numOfVotings);
    // force update for quick load
    total = numOfVotings;

    await loadMore();
  }

  async function deployVoting(data: any) {
    if (!tonClient) return;

    setCreateVotingOverlayVisible(false);

    const organization = await Organization.fromAddress(
      Address.parse(contractAddress!),
    );

    const deployFee = await organization.getDeployVotingFeePlusTonToLive(
      tonClient.provider(organization.address),
    );

    const tx: SendTransactionRequest = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          address: organization.address.toRawString(),
          amount: (deployFee + toNano(0.1)).toString(),
          payload: beginCell()
            .store(
              storeDeployVotingWithMetadata({
                $$type: "DeployVotingWithMetadata",
                metadata: {
                  $$type: "Metadata",
                  name: data.name,
                  description: data.description,
                  emoji: data.emoji,
                  website: data.website,
                },
                voteFee: toNano(data.voteFee),
                votesPerCandidate: BigInt(data.votesPerCandidate),
                startTime: BigInt(Math.floor(data.startTime.getTime() / 1000)),
                timeToLive: BigInt(
                  Math.floor(
                    (data.endTime.getTime() - data.startTime.getTime()) / 1000,
                  ),
                ),
                candidates: NewCandidateArray(
                  data.candidates.map((candidate: any) => [
                    candidate.name,
                    candidate.info,
                  ]),
                ),
              }),
            )
            .endCell()
            .toBoc()
            .toString("base64"),
        },
      ],
    };
    await tonConnectUi.sendTransaction(tx);
  }

  async function withdrawFunds(data: any) {
    if (!tonClient) return;

    setWithdrawOverlayVisible(false);

    const organization = Organization.fromAddress(
      Address.parse(contractAddress!),
    );

    const tx: SendTransactionRequest = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          address: organization.address.toRawString(),
          amount: toNano(0.1).toString(),
          payload: beginCell()
            .store(
              storeWithdraw({
                $$type: "Withdraw",
                amount: toNano(data.amount!),
              }),
            )
            .endCell()
            .toBoc()
            .toString("base64"),
        },
      ],
    };

    await tonConnectUi.sendTransaction(tx);
  }

  async function editMetadata(data: any) {
    if (!tonClient) return;

    setEditOrganizationOverlayVisible(false);

    const organization = Organization.fromAddress(
      Address.parse(contractAddress!),
    );

    const tx: SendTransactionRequest = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          address: organization.address.toRawString(),
          amount: toNano(0.1).toString(),
          payload: beginCell()
            .store(
              storeUpdateOrganizationInfo({
                $$type: "UpdateOrganizationInfo",
                emoji: data.emoji,
                name: data.name,
                description: data.description,
                website: data.website,
              }),
            )
            .endCell()
            .toBoc()
            .toString("base64"),
        },
      ],
    };

    await tonConnectUi.sendTransaction(tx);
  }

  async function transferOwnership(data: any) {
    if (!tonClient) return;

    const organization = Voting.fromAddress(Address.parse(contractAddress!));
    const newOwner = Address.parse(data.newOwner);
    if ((await tonClient.getContractState(newOwner)).state !== "active")
      setErrorMessage("Contract is not active");

    const tx: SendTransactionRequest = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          address: organization.address.toRawString(),
          amount: toNano(0.1).toString(),
          payload: beginCell()
            .store(
              storeTransferOwnership({
                $$type: "TransferOwnership",
                newOwner: newOwner,
              }),
            )
            .endCell()
            .toBoc()
            .toString("base64"),
        },
      ],
    };

    await tonConnectUi.sendTransaction(tx);
    setTransgerOwnershipOverlayVisible(false);
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
    <div className="flex flex-wrap">
      <div className="w-full sm:w-2/5 p-2 sticky">
        <Box name={isLoaded ? metadata.name : "Loading..."}>
          <div>
            {isLoaded ? (
              <div className="relative">
                {isMyOrganization() ? (
                  <div className="absolute top-0 right-0 w-4 h-4">
                    <button
                      className="text-white"
                      onClick={() => {
                        setEditOrganizationOverlayVisible(true);
                      }}
                    >
                      <EditSvg />
                    </button>
                  </div>
                ) : null}
                <div className="flex w-full items-center justify-center mb-2 select-none">
                  <div className="rounded-full text-3xl bg-gray-300 w-14 h-14 mr-2 flex items-center justify-center">
                    {metadata.emoji}
                  </div>
                </div>

                <div className="font-light mb-2">{metadata.description}</div>

                <InfoTable info={allInfo()} />
              </div>
            ) : (
              <div className="animate-pulse flex flex-col gap-2">
                {Array(9)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="h-5 bg-slate-800 w-full"></div>
                  ))}
              </div>
            )}
          </div>
        </Box>
        {isMyOrganization() && (
          <div>
            <div className="flex flex-row w-full justify-between gap-2">
              <button
                className="bg-slate-900 text-white px-4 py-2 rounded-xl mt-4"
                onClick={() => {
                  if (!wallet) tonConnectUi.openModal();
                  else setCreateVotingOverlayVisible(true);
                }}
              >
                Create Voting
              </button>
              <button
                className="bg-slate-900 text-white px-4 py-2 rounded-xl mt-4"
                onClick={() => {
                  if (!wallet) tonConnectUi.openModal();
                  else setWithdrawOverlayVisible(true);
                }}
              >
                Withdraw Funds
              </button>
              <button
                className="bg-slate-900 text-white px-4 py-2 rounded-xl mt-4"
                onClick={() => {
                  if (!wallet) tonConnectUi.openModal();
                  else setTransgerOwnershipOverlayVisible(true);
                }}
              >
                Transfer Ownership
              </button>
            </div>
            <Overlay
              isOpen={createVotingOverlayVisible}
              onClose={() => setCreateVotingOverlayVisible(false)}
            >
              <div className="text-xl mb-2">Create Voting</div>
              <FormsCustom
                fields={newVotingFields}
                onFormSubmit={deployVoting}
              />
            </Overlay>
            <Overlay
              isOpen={withdrawOverlayVisible}
              onClose={() => setWithdrawOverlayVisible(false)}
            >
              <div className="text-xl mb-2">Withdraw Funds</div>
              <FormsCustom
                fields={getWithdrawFields(
                  Math.floor(Number(fromNano(contractBalance)) * 1000) / 1000,
                  Math.floor(Number(fromNano(contractBalance)) * 1000) / 1000,
                )}
                onFormSubmit={withdrawFunds}
              />
            </Overlay>
            <Overlay
              isOpen={editOrganizationOverlayVisible}
              onClose={() => setEditOrganizationOverlayVisible(false)}
            >
              <div className="text-xl mb-2">Edit Organization</div>
              <FormsCustom
                fields={getEditOrganizationFields(metadata)}
                onFormSubmit={editMetadata}
              />
            </Overlay>
            <Overlay
              isOpen={transgerOwnershipOverlayVisible}
              onClose={() => setTransgerOwnershipOverlayVisible(false)}
            >
              <div className="text-xl mb-2">Transfer Ownership</div>
              <FormsCustom
                fields={transferOwnershipFields}
                onFormSubmit={transferOwnership}
              />
            </Overlay>
          </div>
        )}
      </div>
      <div className="w-full sm:w-3/5 p-2">
        <div className="grid md:grid-cols-2 gap-4">
          {votings.map((voting) => (
            <Link key={voting.address} to={`/voting?a=${voting.address}`}>
              <Box name={voting.info.name} hover={true}>
                <div className="flex flex-row">
                  <div className="w-2/5">
                    <div className="flex w-full items-center justify-center mb-2 h-full">
                      <div className="rounded-full text-3xl bg-gray-300 w-14 h-14 mr-2 flex items-center justify-center">
                        {voting.info.emoji}
                      </div>
                    </div>
                  </div>
                  <div className="w-3/5 pl-2">
                    <div className="font-light h-24 overflow-y-scroll">
                      {voting.info.description}
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
                <Box
                  hover={false}
                  className="animate-pulse"
                  key={index}
                  name={"Loading..."}
                >
                  <div className="flex flex-row">
                    <div className="w-2/5">
                      <div className="flex w-full items-center justify-center mb-2 h-full">
                        <div className="rounded-full text-3xl bg-gray-300 w-14 h-14 mr-2 flex items-center justify-center"></div>
                      </div>
                    </div>
                    <div className="w-3/5 pl-2">
                      <div className="font-light h-24 overflow-y-scroll">
                        {Array(3)
                          .fill(0)
                          .map((_, index) => (
                            <div
                              key={index}
                              className="h-5 bg-slate-800 mb-2 w-full"
                            ></div>
                          ))}
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
                "bg-slate-900 text-white px-4 py-2 rounded-xl animate-" +
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
      <Overlay isOpen={errorMessage !== ""} onClose={() => setErrorMessage("")}>
        <div className="p-4 bg-red-600 text-white rounded-md">
          {errorMessage}
        </div>
      </Overlay>
    </div>
  );
};
