// @flow

type Props = {|
  schema: Object,
  values: Object
|}

const Filters = ({
  schema,
  values
}: Props) => {
  const checkboxGroupParams = schema.parameters.filter(
    param => param.in === 'query' && 'enum' in param.schema
  );
  return (
    <div>
      {checkboxGroupParams.map(param => (
        <fieldset key={param.name}>
          <legend>{param.title}</legend>
          {param.schema.enum.map((value, i) => (
            <label key={`${param.name}_${value}`}>
              <span>{param.schema.enumTitles[i]}</span>
              <input
                type='checkbox'
                value={value}
                name={param.name}
                checked={
                  values[param.name] &&
                  values[param.name].indexOf(value) !== -1
                }
                onChange={(e) => console.info(e)} />
            </label>
          ))}
        </fieldset>
      ))}
    </div>
  );
};
export default Filters;
