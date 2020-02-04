import React from "react";
import {localization} from "../../../services/clientWorkers/LocalizationService";

import "./style.scss";


export function Footer (props: any) {
  return (
    <footer className = "footerBar">
      <div className = "footerDevelopers">
        <h5>
          {
            localization.development() +
            ": " +
            localization.developers().join(", ")
          }
        </h5>
      </div>
      <div className = "footerCopyright">
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
