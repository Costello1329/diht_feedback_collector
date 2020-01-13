import React from "react";
import {Header} from "../../components/bars/header/Header";
import {Footer} from "../../components/bars/footer/Footer";
import {PollComponent} from "../../components/PollComponent";
import {User} from "../../services/api/UserService";


interface PollLayoutProps {
  user: User;
  pollGuid: string;
}

export class PollLayout
extends React.Component<PollLayoutProps> {
  constructor (props: PollLayoutProps) {
    super(props);
  }
  
  render (): JSX.Element {
    const layout: JSX.Element =
      <div>
        <Header userName = {this.props.user.login}/>
        <PollComponent/>
        <Footer/>
      </div>;


    return layout;
  }
}
