import React from "react";
import {Header} from "../../components/bars/header/Header";
import {Footer} from "../../components/bars/footer/Footer";
import {PollComponent} from "../../components/poll/PollComponent";
import {AuthorizedUser} from "../../services/clientWorkers/sessions/User";


export interface PollLayoutProps {
  user: AuthorizedUser;
}

export class PollLayout
extends React.Component<PollLayoutProps> {
  constructor (props: PollLayoutProps) {
    super(props);
  }
  
  render (): JSX.Element {
    const pollGuid: string = location.hash.split("/")[1];

    const layout: JSX.Element =
      <div>
        <Header userName = {this.props.user.login}/>
        <PollComponent guid = {pollGuid}/>
        <Footer/>
      </div>;

    return layout;
  }
}
