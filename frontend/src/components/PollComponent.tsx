import React from "react";
import {PollRadioButton} from "./poll/PollRadioButton";
import {PollSlider} from "./poll/PollSlider";
import {PollInput} from "./poll/PollInput";
import {PollSelect} from "./poll/PollSelect";
import {localization} from "../services/LocalizationService";
// @ts-ignore
import courseImage from "../../assets/images/courseImage.png";
import "../styles/pollboard.scss";
import {Button, ButtonType, ButtonSize} from "./interface/button/Button";


interface PollComponentProps {

}

interface PollComponentState {

}

export class PollComponent extends
React.Component<PollComponentProps, PollComponentState> {
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
          <div className="answerInfoBox">
            <h2>АКОС ФИВТ 2019-2020</h2>
            <img src={courseImage} />
            <div className = "answerInfoBoxButton">
              <Button
                type = {ButtonType.orange}
                size = {ButtonSize.medium}
                text = {"Сохранить ответ"}
                handler = {
                  (): void => {alert("hi");}
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
