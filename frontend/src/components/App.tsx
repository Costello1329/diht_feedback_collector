import React from "react";
import {AuthLayout} from "../layouts/authLayout";
import {PollDashboardLayout} from "../layouts/pollDashboardLayout";
import {Notifications} from "../components/NotificationsComponent";
import {notificationService} from "../services/NotificationService";


const App: React.FunctionComponent = (): JSX.Element => {
  return (
    <div className = "App">
      <AuthLayout
        registrationLink = "/registration"
        authorizationLink = "/authorization"
      />
      <PollDashboardLayout
        pollDashboardLink = "/polls"
        pollLink = "/poll"
      />
      <Notifications
        ref = {notificationService.getRef()}
        maxShownNotificationsCount = {3}
        maxPendingNotificationsCount = {10}
        key = "1"
      />
    </div>
  );
}

export default App;
