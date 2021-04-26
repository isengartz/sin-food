import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import './dropDownWithButton.less';

interface DropDownWithButtonProps {
  options?: {
    value: string;
    text: string;
  }[];
  buttonText: string;
  onBtnClick: (value: string | undefined) => void;
  defaultSelectedOption?: string;
}

/**
 * Renders a dropdown list with a button on the right
 * @param options
 * @param buttonText
 * @param onBtnClick
 * @param defaultSelectedOption
 * @constructor
 */
const DropDownWithButton: React.FC<DropDownWithButtonProps> = ({
  options,
  buttonText,
  onBtnClick,
  defaultSelectedOption,
}) => {
  const [optionSelected, setOptionSelected] = useState<string>();

  // If we pass a default selected option set it to state
  useEffect(() => {
    if (defaultSelectedOption) {
      const foundItem = options?.find(
        (item) => item.value === defaultSelectedOption,
      );
      foundItem && setOptionSelected(foundItem.value);
    } else {
      // else set as selected the first option
      !optionSelected &&
        options &&
        options?.length > 0 &&
        setOptionSelected(options[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSelectedOption]);

  return (
    <div className="dropDownWithBtn">
      <select
        className="dropDownWithBtn__select"
        value={optionSelected}
        onChange={(e) => setOptionSelected(e.target.value)}
      >
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
      </select>
      <Button
        className="dropDownWithBtn__btn"
        type="primary"
        onClick={() => onBtnClick(optionSelected)}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default DropDownWithButton;
