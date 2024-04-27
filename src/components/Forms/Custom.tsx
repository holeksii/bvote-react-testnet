import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EmojiPicker, { Theme } from "emoji-picker-react";

interface Field {
  name: string;
  label: string;
  type: string;

  initialValue: any;
  max?: number;
  min?: number;
  step?: number;
  fields?: Field[];
  validators?: any[];
  isRequired?: boolean;
}

interface CustomizableFormProps {
  fields: Field[];
  onFormSubmit: (formData: any) => void;
}

const CustomizableForm = ({ fields, onFormSubmit }: CustomizableFormProps) => {
  
  const initialFormData = {} as any;
  const initialFormErrors = {} as any;

  // Initialize form data and errors based on the provided fields
  fields.forEach((field) => {
    // if is list copy
    if (Array.isArray(field.initialValue)) {
      initialFormData[field.name] = [...field.initialValue];
    } else {
      initialFormData[field.name] = field.initialValue || "";
    }

    initialFormErrors[field.name] = "";
  });

  const [formData, setFormData] = useState(initialFormData as any);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false); // State to manage EmojiPicker visibility

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // if field is not required return
    const field = fields.find((field) => field.name === name);

    let isValidationError = false
    // if validators list value is not empty
    if (field?.validators && value) {
      field.validators.forEach((validator) => {
        const errorMessage = validator(value);
        if (errorMessage) {
         isValidationError = true
        }
      });
    }

    // if no validation error set form errors to empty
    if (!isValidationError) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
    

    if (!field?.isRequired) {
      return;
    }

    setFormErrors({
      ...formErrors,
      [name]: value.trim() === "" ? `${name} is required` : "",
    });
  };

  const handleDateChange = (date: any, name: any) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleEmojiClick = (emoji: any, name: any) => {
    setFormData({ ...formData, [name]: emoji.emoji });
    setIsEmojiPickerOpen(false); // Close EmojiPicker after selecting an emoji
    // fix error message
    setFormErrors({
      ...formErrors,
      [name]: emoji.emoji.trim() === "" ? `${name} is required` : "",
    });
  };

  const handleToggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen); // Toggle EmojiPicker visibility
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let errorsExist = false;
    const newFormErrors = { ...formErrors };

    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      // check if field is required
      const field = fields.find((field) => field.name === key);

      // if validators list value is not empty
      if (field?.validators && value
        
      ) {
        console.log("validating");
        field.validators.forEach((validator) => {
          const errorMessage = validator(value);
          if (errorMessage) {
            newFormErrors[key] = errorMessage;
            errorsExist = true;
          }
        });
      }

      // if not required return
      if (!field?.isRequired) {
        return;
      }

      if (typeof value === "string" && value.trim() === "") {
        newFormErrors[key] = `${key} is required`;
        errorsExist = true;
      } else if (!value && (typeof value !== "object" || !value.getTime)) {
        // Check if value is falsy or not an object with a getTime function (for Date objects)
        newFormErrors[key] = `${key} is required`;
        errorsExist = true;
      }
      // if list is empty
      if (Array.isArray(value) && value.length === 0) {
        newFormErrors[key] = `${key} is required`;
        errorsExist = true;
      }
    });

    if (errorsExist) {
      setFormErrors(newFormErrors);
      return;
    }

    // Data is valid, do something with it or don't IDC
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {fields.map((field) => (
        <div className="mb-4" key={field.name}>
          <label className="block mb-1">{field.label}:</label>
          {field.type === "text" && (
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 bg-slate-900"
            />
          )}
          {field.type === "datepicker" && (
            <DatePicker
              selected={formData[field.name]}
              showTimeSelect={true}
              onChange={(date) => handleDateChange(date, field.name)}
              className="w-full rounded px-3 py-2 bg-slate-900"
              dateFormat="Pp"
            />
          )}
          {
            // text input for website
            field.type === "textarea" && (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full rounded px-3 py-2 bg-slate-900"
              />
            )
          }
          {field.type === "emoji" && (
            <div className="">
              <div className="flex items-center mb-2">
                <div className="rounded-full text-3xl bg-gray-300 w-14 h-14 mr-2 flex items-center justify-center">
                  {formData[field.name]}
                </div>
                <button
                  type="button"
                  onClick={
                    () => setIsEmojiPickerOpen(!isEmojiPickerOpen) // Toggle EmojiPicker visibility
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Select Emoji
                </button>
              </div>
              <EmojiPicker
                width="320px"
                theme={Theme.DARK}
                onEmojiClick={(emoji) => handleEmojiClick(emoji, field.name)}
                open={isEmojiPickerOpen}
              />
            </div>
          )}
          {
            // num
            field.type === "number" && (
              <input
                type="number"
                name={field.name}
                value={formData[field.name]}
                max={field.max}
                min={field.min}
                step={field.step}
                onChange={handleChange}
                className="w-full rounded px-3 py-2 bg-slate-900"
              />
            )
          }
          {
            // reccuring
            field.type === "reccuring" && (
              // for every field in list spawn 1 more form

              <div className="w-full">
                {Object.keys(formData[field.name]).map((key, index) => (
                  <div
                    key={index}
                    className="border mb-2 rounded-xl p-2 border-slate-800"
                  >
                    {
                      // for every field in list spawn 1 more form
                      field.fields!.map((subField: any) => (
                        <div className="mb-4" key={subField.name}>
                          <label className="block mb-1">
                            {subField.label}:
                          </label>

                          <input
                            type="text"
                            name={subField.name}
                            value={formData[field.name][key][subField.name]}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData[field.name][key][subField.name] =
                                e.target.value;
                              setFormData(newFormData);
                            }}
                            className="w-full rounded px-3 py-2 bg-slate-900"
                          />
                        </div>
                      ))
                    }
                  </div>
                ))}
                <div className="flex flex-row gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const newFormData = { ...formData };
                      newFormData[field.name][
                        Object.keys(formData[field.name]).length
                      ] = {
                        ...field.fields!.reduce((acc: any, subField: any) => {
                          acc[subField.name] = "";
                          return acc;
                        }, {}),
                      };
                      setFormData(newFormData);
                      // fix error message
                      setFormErrors({
                        ...formErrors,
                        [field.name]: "",
                      });
                    }}
                    className="bg-blue-500 text-white h-8 w-8 rounded-full hover:bg-blue-600"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      formData[field.name].length = Math.max(
                        0,
                        formData[field.name].length - 1,
                      );
                      setFormData({ ...formData });
                    }}
                    className="bg-gray-500 text-white h-8 w-8 rounded-full hover:bg-red-600"
                  >
                    -
                  </button>
                </div>
              </div>
            )
          }

          <div className="text-red-500 text-sm">{formErrors[field.name]}</div>
        </div>
      ))}
      <div className="w-full flex flex-row justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CustomizableForm;
