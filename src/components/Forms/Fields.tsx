import { tonInputStep } from "../../constants";
import { addressValidator, websiteValidator } from "./Validators";

export function getWithdrawFields(initial: number, max: number) {
  return [
    {
      name: "amount",
      label: "Amount (TON)",
      type: "number",
      initialValue: Number(initial),
      max: Number(max),
      min: 0,
      step: tonInputStep,
      isRequired: true,
    },
  ];
}

export function getEditOrganizationFields(metadata: any) {
  return [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
      initialValue: metadata.name,
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      required: true,
      initialValue: metadata.description,
    },
    {
      name: "emoji",
      type: "emoji",
      label: "Emoji",
      required: true,
      initialValue: metadata.emoji,
    },
    {
      name: "website",
      type: "text",
      label: "Website",
      required: false,
      initialValue: metadata.website,
      validators: [websiteValidator],
    },
  ];
}

export const transferOwnershipFields = [
  {
    name: "newOwner",
    label: "New Owner",
    type: "text",
    initialValue: "",
    isRequired: true,
    validators: [addressValidator],
  },
];

export const newOrganizationFields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    initialValue: "",
    isRequired: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    initialValue: "",
    isRequired: true,
  },
  { name: "emoji", label: "Emoji", type: "emoji", isRequired: true },
  {
    name: "website",
    label: "Website",
    type: "text",
    initialValue: "",
    isRequired: false,
    validators: [websiteValidator],
  },
] as any;

export const newVotingFields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    initialValue: "",
    isRequired: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    initialValue: "",
    isRequired: true,
  },
  { name: "emoji", label: "Emoji", type: "emoji", isRequired: true },
  {
    name: "website",
    label: "Website",
    type: "text",
    initialValue: "",
    isRequired: false,
  },
  {
    name: "voteFee",
    label: "Vote Fee (TON)",
    type: "number",
    initialValue: "0",
    min: 0,
    step: tonInputStep,
    isRequired: true,
  },
  {
    name: "votesPerCandidate",
    label: "Votes Per Candidate",
    type: "number",
    initialValue: 1,
    min: 1,
    isRequired: true,
  },
  {
    name: "startTime",
    label: "Start Time",
    type: "datepicker",
    initialValue: new Date(),
    isRequired: true,
  },
  {
    name: "endTime",
    label: "End Time",
    type: "datepicker",
    initialValue: new Date(),
    isRequired: true,
  },
  {
    name: "candidates",
    label: "Candidates",
    type: "reccuring",
    initialValue: [],
    isRequired: true,
    fields: [
      { name: "name", label: "Name", type: "text", initialValue: "" },
      { name: "info", label: "Info", type: "text", initialValue: "" },
    ],
  },
] as any;
