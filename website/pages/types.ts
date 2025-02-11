export type User = {
  Id: string,
  Username: string,
}

export type Transaction = {
  Id: number,
  Sender: User,
  Reason: string,
  Amount: number,
  Status: number,
}