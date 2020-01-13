import React from "react";
import {Link} from "react-router-dom";


interface ForbiddenLayoutProps {
  registrationLink: string,
  authorizationLink: string
}

export class ForbiddenLayout
extends React.Component<ForbiddenLayoutProps> {
  constructor (props: ForbiddenLayoutProps) {
    super(props);
  }

  render (): JSX.Element {
    const layout: JSX.Element =
      <div>
        <h1>Доступ запрещен.</h1>
        <Link to = {this.props.registrationLink}>Зарегистрируйтесь</Link>
        <Link to = {this.props.authorizationLink}>Авторизируйтесь</Link>
      </div>;

    return layout;
  }
  
}
