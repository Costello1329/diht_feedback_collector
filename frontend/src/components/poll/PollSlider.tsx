import React, {useState} from "react";

type PollSliderProps = {
  initial: number;
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const getMarkText = (mark: number): string => {
  if (mark === 0)
    return "отчисл(0)";
  else if (mark > 0 && mark <= 2)
    return "неуд(" + mark + ")";
  else if (mark > 2 && mark <= 4)
    return "уд(" + mark + ")";
  else if (mark > 4 && mark <= 7)
    return "хор(" + mark + ")";
  else
    return "отл(" + mark + ")";
}

export function PollSlider(props: PollSliderProps) {
  const [mark, setMark] = useState<number>(props.initial);
  const handleChange = (event: any) => {
    setMark(event.target.value);
    props.handler(event);
  }
  return (
    <div className="sliderBox">
      <input
        type="range"
        min="0"
        max="10"
        value={mark}
        onChange={handleChange}
      />
      <p>Оценка: {getMarkText(mark)}</p>
    </div>
  );
}
