import React from "react";
import {Header} from "../../components/bars/header/Header";
import {Footer} from "../../components/bars/footer/Footer";
import {PollComponent} from "../../components/poll/PollComponent";
import {AuthorizedUser} from "../../services/clientWorkers/sessions/User";


interface PollLayoutProps {
  user: AuthorizedUser;
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
        {this.props.pollGuid}
        {/* <PollComponent guid = {this.props.pollGuid}/> */}
        <Footer/>
      </div>;


    return layout;
  }
}
