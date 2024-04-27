# TACT Compilation Report
Contract: Voting
BOC Size: 2692 bytes

# Types
Total Types: 28

## StateInit
TLB: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

## Context
TLB: `_ bounced:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounced:bool,sender:address,value:int257,raw:^slice}`

## SendParameters
TLB: `_ bounce:bool to:address value:int257 mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell = SendParameters`
Signature: `SendParameters{bounce:bool,to:address,value:int257,mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell}`

## Deploy
TLB: `deploy#946a98b6 queryId:uint64 = Deploy`
Signature: `Deploy{queryId:uint64}`

## DeployOk
TLB: `deploy_ok#aff90f57 queryId:uint64 = DeployOk`
Signature: `DeployOk{queryId:uint64}`

## FactoryDeploy
TLB: `factory_deploy#6d0ff13b queryId:uint64 cashback:address = FactoryDeploy`
Signature: `FactoryDeploy{queryId:uint64,cashback:address}`

## ChangeOwner
TLB: `change_owner#819dbe99 queryId:uint64 newOwner:address = ChangeOwner`
Signature: `ChangeOwner{queryId:uint64,newOwner:address}`

## ChangeOwnerOk
TLB: `change_owner_ok#327b2b4a queryId:uint64 newOwner:address = ChangeOwnerOk`
Signature: `ChangeOwnerOk{queryId:uint64,newOwner:address}`

## InitOrganization
TLB: `init_organization#94002cae owner:address = InitOrganization`
Signature: `InitOrganization{owner:address}`

## InitOrganizationWithMetadata
TLB: `init_organization_with_metadata#caedd2bf owner:address metadata:Metadata{name:^string,description:^string,emoji:^string,website:^string} = InitOrganizationWithMetadata`
Signature: `InitOrganizationWithMetadata{owner:address,metadata:Metadata{name:^string,description:^string,emoji:^string,website:^string}}`

## UpdateOrganizationInfo
TLB: `update_organization_info#84698a07 emoji:^string name:^string description:^string website:^string = UpdateOrganizationInfo`
Signature: `UpdateOrganizationInfo{emoji:^string,name:^string,description:^string,website:^string}`

## DeployVoting
TLB: `deploy_voting#8c30e194 candidates:CandidateArray{size:uint8,candidates:dict<uint64, ^Candidate{name:^string,info:^string,votes:uint64}>} voteFee:uint64 votesPerCandidate:uint8 startTime:uint64 timeToLive:uint64 = DeployVoting`
Signature: `DeployVoting{candidates:CandidateArray{size:uint8,candidates:dict<uint64, ^Candidate{name:^string,info:^string,votes:uint64}>},voteFee:uint64,votesPerCandidate:uint8,startTime:uint64,timeToLive:uint64}`

## DeployVotingWithMetadata
TLB: `deploy_voting_with_metadata#c1f3cbaf candidates:CandidateArray{size:uint8,candidates:dict<uint64, ^Candidate{name:^string,info:^string,votes:uint64}>} voteFee:uint64 votesPerCandidate:uint8 startTime:uint64 timeToLive:uint64 metadata:Metadata{name:^string,description:^string,emoji:^string,website:^string} = DeployVotingWithMetadata`
Signature: `DeployVotingWithMetadata{candidates:CandidateArray{size:uint8,candidates:dict<uint64, ^Candidate{name:^string,info:^string,votes:uint64}>},voteFee:uint64,votesPerCandidate:uint8,startTime:uint64,timeToLive:uint64,metadata:Metadata{name:^string,description:^string,emoji:^string,website:^string}}`

## SetDeployVotingFee
TLB: `set_deploy_voting_fee#e91f83f1 newFee:uint64 = SetDeployVotingFee`
Signature: `SetDeployVotingFee{newFee:uint64}`

## OrganizationBasicInfo
TLB: `_ emoji:^string name:^string website:^string = OrganizationBasicInfo`
Signature: `OrganizationBasicInfo{emoji:^string,name:^string,website:^string}`

## OrganizationAllInfo
TLB: `_ owner:address emoji:^string name:^string description:^string website:^string numOfVotings:uint64 = OrganizationAllInfo`
Signature: `OrganizationAllInfo{owner:address,emoji:^string,name:^string,description:^string,website:^string,numOfVotings:uint64}`

## Metadata
TLB: `_ name:^string description:^string emoji:^string website:^string = Metadata`
Signature: `Metadata{name:^string,description:^string,emoji:^string,website:^string}`

## Withdraw
TLB: `withdraw#0ba69751 amount:coins = Withdraw`
Signature: `Withdraw{amount:coins}`

## TransferOwnership
TLB: `transfer_ownership#70373fea newOwner:address = TransferOwnership`
Signature: `TransferOwnership{newOwner:address}`

## Candidate
TLB: `_ name:^string info:^string votes:uint64 = Candidate`
Signature: `Candidate{name:^string,info:^string,votes:uint64}`

## CandidateArray
TLB: `_ size:uint8 candidates:dict<uint64, ^Candidate{name:^string,info:^string,votes:uint64}> = CandidateArray`
Signature: `CandidateArray{size:uint8,candidates:dict<uint64, ^Candidate{name:^string,info:^string,votes:uint64}>}`

## InitVoting
TLB: `init_voting#fd1fc2bf owner:address candidates:CandidateArray{size:uint8,candidates:dict<uint64, ^Candidate{name:^string,info:^string,votes:uint64}>} voteFee:uint64 votesPerCandidate:uint8 startTime:uint64 timeToLive:uint64 = InitVoting`
Signature: `InitVoting{owner:address,candidates:CandidateArray{size:uint8,candidates:dict<uint64, ^Candidate{name:^string,info:^string,votes:uint64}>},voteFee:uint64,votesPerCandidate:uint8,startTime:uint64,timeToLive:uint64}`

## InitVotingWithMetadata
TLB: `init_voting_with_metadata#dc1d2ffc owner:address candidates:CandidateArray{size:uint8,candidates:dict<uint64, ^Candidate{name:^string,info:^string,votes:uint64}>} voteFee:uint64 votesPerCandidate:uint8 startTime:uint64 timeToLive:uint64 metadata:Metadata{name:^string,description:^string,emoji:^string,website:^string} = InitVotingWithMetadata`
Signature: `InitVotingWithMetadata{owner:address,candidates:CandidateArray{size:uint8,candidates:dict<uint64, ^Candidate{name:^string,info:^string,votes:uint64}>},voteFee:uint64,votesPerCandidate:uint8,startTime:uint64,timeToLive:uint64,metadata:Metadata{name:^string,description:^string,emoji:^string,website:^string}}`

## DeployAndCastVote
TLB: `deploy_and_cast_vote#61e07107 candidateInd:uint8 numOfVotes:uint8 = DeployAndCastVote`
Signature: `DeployAndCastVote{candidateInd:uint8,numOfVotes:uint8}`

## DeployAndCastVoteOk
TLB: `deploy_and_cast_vote_ok#f60d9235 voter:address candidateInd:uint8 numOfVotes:uint8 = DeployAndCastVoteOk`
Signature: `DeployAndCastVoteOk{voter:address,candidateInd:uint8,numOfVotes:uint8}`

## VotingBasicInfo
TLB: `_ emoji:^string name:^string startTime:uint64 endTime:uint64 = VotingBasicInfo`
Signature: `VotingBasicInfo{emoji:^string,name:^string,startTime:uint64,endTime:uint64}`

## VotingAllInfo
TLB: `_ organization:address owner:address emoji:^string name:^string description:^string numOfVotes:uint64 voteFee:uint64 votesPerCandidate:uint8 startTime:uint64 endTime:uint64 = VotingAllInfo`
Signature: `VotingAllInfo{organization:address,owner:address,emoji:^string,name:^string,description:^string,numOfVotes:uint64,voteFee:uint64,votesPerCandidate:uint8,startTime:uint64,endTime:uint64}`

## CastVote
TLB: `cast_vote#4d87f18b owner:address candidateInd:uint8 numOfVotes:uint8 = CastVote`
Signature: `CastVote{owner:address,candidateInd:uint8,numOfVotes:uint8}`

# Get Methods
Total Get Methods: 13

## organization

## votingId

## candidates

## numOfVotes

## voteFee

## votesPerCandidate

## startTime

## timeToLive

## metadata

## voteAddress
Argument: owner

## basicInfo

## allInfo

## owner

# Error Codes
2: Stack undeflow
3: Stack overflow
4: Integer overflow
5: Integer out of expected range
6: Invalid opcode
7: Type check error
8: Cell overflow
9: Cell underflow
10: Dictionary error
13: Out of gas error
32: Method ID not found
34: Action is invalid or not supported
37: Not enough TON
38: Not enough extra-currencies
128: Null reference exception
129: Invalid serialization prefix
130: Invalid incoming message
131: Constraints error
132: Access denied
133: Contract stopped
134: Invalid argument
135: Code of a contract was not found
136: Invalid address
137: Masterchain support is not enabled for this contract
13397: Invalid number of votes
15509: Only deployer is allowed to withdraw
24647: Only repository can deploy organization
26215: Only the owner can cast votes
26998: Not enough value to deploy voting
28869: Votes already casted
34218: Only the organization can deploy the voting contract
37618: Only the voting contract can deploy this contract
38223: Start time should be in the future
51754: Insufficient funds
54147: Voting has not started yet
54615: Insufficient balance
59195: Voting has ended
59846: Voting has not ended yet