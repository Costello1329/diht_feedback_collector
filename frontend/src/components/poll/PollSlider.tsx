import React, {useState} from "react";

type PollSliderProps = {

}

export function PollSlider(props: PollSliderProps) {
  const [mark, setMark] = useState(0);
  const handleChange = (event: any) =>
    setMark(event.target.value);
  return (
    <div className="sliderBox">
      <input
        type="range"
        min="0"
        max="10"
        value={mark}
        onChange={handleChange}
        />
        <p>Оценка: {mark}</p>
    </div>
  );
}
