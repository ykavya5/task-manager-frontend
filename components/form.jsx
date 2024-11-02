import styles from "./form.module.css";
function FormField ({name, type, placeholder, value, onChange}){
    return(
    
        <input className = {styles.inputField} value={value} onChange={onChange} name={name} type={type} placeholder={placeholder} />
       

    )
}

export default function Form({ formFields, onSubmit, error, errorMessages, submitLabel}){
    return(
        <form onSubmit={onSubmit}>{
            formFields.map((field, index)=>(
                <>
                <FormField key= {index} value = {field?.value} onChange = {field?.onChange} name = {field?.name} type= {field?.type} placeholder = {field?.placeholder} />
                {error[field.name]? <p className= {styles.errorMessage}> {errorMessages[field.name].message}</p>: null}
                </>
            ))
        }

    <button type = "submit" className = {styles.submitbtn}> {submitLabel} </button>

        </form>
    )
}