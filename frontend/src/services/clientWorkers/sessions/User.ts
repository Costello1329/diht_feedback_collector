export abstract class User {}

export class UnauthorizedUser extends User {}

export abstract class AuthorizedUser extends User {
  declare private readonly _login: string;

  constructor (login: string) {
    super();
    this._login = login;
  }

  get login (): string {
    return this._login;
  }
}

export class StudentUser extends AuthorizedUser {
  declare private readonly _group: string

  constructor (login: string, group: string) {
    super(login);
    this._group = group;
  }

  get group (): string {
    return this._group;
  }
}

export class LeaderUser extends StudentUser {
  constructor (login: string, group: string) {
    super(login, group);
  }
}
