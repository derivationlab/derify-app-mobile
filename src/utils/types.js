

export class TraderAccount {
  balance;
  marginBalance;
  totalMargin;
  marginRate;
  totalPositionAmount;
  availableMargin;

  constructor() {
    this.balance = 0
    this.marginBalance = 0
    this.totalMargin = 0
    this.availableMargin = 0
  }
}

export class TraderVariable {
  marginBalance;
  totalPositionAmount;
  marginRate;

  constructor() {
    this.marginBalance = 0;
    this.totalPositionAmount = 0;
    this.marginRate = 0;
  }
}
