import React from "react";
import {localization} from "../../../services/clientWorkers/LocalizationService";

import "./style.scss";


export function Footer (props: any) {
  return (
    <footer className = "appFooterBar">
      <div className = "appFooterDevelopers">
        <h5>
          {
            localization.development() +
            ": " +
            localization.developers().join(", ")
          }
        </h5>
      </div>
      <div className = "appFooterCopyright">
        <h5>
          {
            localization.mainTitle() +
            " © " +
            new Date().getFullYear()
          }
        </h5>
      </div>
    </footer>
  );
}
