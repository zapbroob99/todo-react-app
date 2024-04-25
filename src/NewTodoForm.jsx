import {useState} from "react";

export function NewTodoForm({onSubmit}){

    const [newItem, setNewItem] = useState("")
    function handleSubmit() {
        event.preventDefault()
        if (newItem === ""){return}
        onSubmit(newItem)
        setNewItem("") //deletes the input field after submitting
    }
    return (
        <form autoComplete="off" onSubmit={handleSubmit} className="new-item-form">
            <div className="form-row">
                <label htmlFor="item">New Item</label>
                <input type="text" value={newItem} onChange={event => setNewItem(event.target.value)} id="item"/>
            </div>
            <button className="btn">Add</button>
        </form>
    )
}