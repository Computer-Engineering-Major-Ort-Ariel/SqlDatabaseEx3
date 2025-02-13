export type User = {
  Id: string,
  Username: string,
}

export type Transaction = {
  Id: number,
  Sender: User,
  Recipient: User,
  Reason: string,
  Amount: number,
  Status: number,
  IsTransfer: boolean,
}