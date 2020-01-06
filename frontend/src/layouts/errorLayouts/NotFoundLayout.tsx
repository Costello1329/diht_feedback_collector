import React from "react";
import {Link} from "react-router-dom";


interface NotFoundLayoutProps {
  registrationLink: string,
  authorizationLink: string
}

export class NotFoundLayout
extends React.Component<NotFoundLayoutProps> {
  constructor (props: NotFoundLayoutProps) {
    super(props);
  }

  render (): JSX.Element {
    const layout: JSX.Element =
      <div>
        <h1>Такой страницы не существует.</h1>
        <Link to = {this.props.registrationLink}>Зарегистрируйтесь</Link>
        <Link to = {this.props.authorizationLink}>Авторизируйтесь</Link>
      </div>

    return layout;
  }
  
}
