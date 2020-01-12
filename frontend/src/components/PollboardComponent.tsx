import React from "react";
import {PollRadioButton} from "./pollboard/PollRadioButton";
import {PollSlider} from "./pollboard/PollSlider";
import {PollInput} from "./pollboard/PollInput";
import {PollSelect} from "./pollboard/PollSelect";
import {localization} from "../services/LocalizationService";

interface PollboardProps {

}

interface PollboardState {

}

export class Pollboard extends
React.Component<PollboardProps, PollboardState> {

  render(): JSX.Element {
    return (
      <div className="pollboard">
        <div className="answerEditor">
          <h2>{localization.answerEdition()}</h2>
          <div className="polls">
            <div className="poll">
              <h2>{localization.lectures()}</h2>
              <p>{localization.attendedLectures()}</p>
              <PollRadioButton options={["Да, от Яковлева", "Да, от Кондакова", "Нет"]} name="lections"/>
              <p>{localization.evaluateQualityOfLectures()}</p>
              <PollSlider/>
              <p>{localization.goodAboutLectures()}</p>
              <PollInput/>
              <p>{localization.badAboutLectures()}</p>
              <PollInput/>
              <p>{localization.suggestionAboutLectures()}</p>
              <PollInput/>
            </div>
            <div className="poll">
              <h2>{localization.seminars()}</h2>
              <p>{localization.yourTeacherAndAssist()}</p>
              <PollSelect options={["Кочуков и Леладзе", "Самелюк и Харитонов", "Биба и Боба"]}/>
              <p>{localization.evaluateQualityOfSeminars()}</p>
              <PollSlider/>
              <p>{localization.goodAboutSeminars()}</p>
              <PollInput/>
              <p>{localization.badAboutSeminars()}</p>
              <PollInput/>
              <p>{localization.suggestionAboutSeminars()}</p>
              <PollInput/>
            </div>
          </div>
        </div>
        <div className="answerInfo">
          <h2>Информация об ответе</h2>
        </div>
      </div>
    );
  }
}