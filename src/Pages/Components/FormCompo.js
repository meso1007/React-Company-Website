function InputCompo(props) {
  return (
    <div className="form-floating mt-3">
      <input
        type={props.inputObj.type}
        className="form-control"
        name={props.inputObj.name}
        placeholder={props.inputObj.placeHolder}
        disabled={props.inputObj.disable}
        required={props.inputObj.required}
        value={
          props.inputObj.value != undefined ? props.inputObj.value : undefined
        }
        onChange={
          props.inputObj.inputfunction != undefined
            ? props.inputObj.inputfunction
            : null
        }
      />
      <label htmlFor={props.inputObj.name}>{props.inputObj.placeHolder}</label>
    </div>
  );
}
function SelectCompo(props) {
  return (
    <div className="mt-3">
      <label htmlFor={props.inputObj.name} className="form-label">
        {props.inputObj.placeHolder}
      </label>
      <select
        className="form-select form-select-lg"
        name={props.inputObj.name}
        required={props.inputObj.required}
        disabled={props.inputObj.disabled}
        value={
          props.inputObj.value != undefined ? props.inputObj.value : undefined
        }
        onChange={
          props.inputObj.inputfunction != undefined
            ? props.inputObj.inputfunction
            : null
        }
      >
        {props.inputObj.options.map((option, optionidx) => {
          return (
            <option key={option.id} value={option.val}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default function FormCompo(props) {
  return (
    <form onSubmit={props.submitHandler}>
      {props.inputPattern.formContent.map((inputObj, idx) => {
        return (
          <>
            {inputObj.type == "select" ? (
              <SelectCompo inputObj={inputObj} key={inputObj.id} />
            ) : (
              <InputCompo key={inputObj.id} inputObj={inputObj} />
            )}
          </>
        );
      })}
      <div className="text-end">
        {props.inputPattern.formButtons.map((btnObj, btnIdx) => {
          return (
            <button
              type={btnObj.type}
              key={btnObj.id}
              className={`btn btn-outline-${btnObj.color} mt-3`}
              onClick={
                btnObj.functionHandler != undefined
                  ? btnObj.functionHandler
                  : null
              }
            >
              {btnObj.label}
            </button>
          );
        })}
      </div>
    </form>
  );
}
