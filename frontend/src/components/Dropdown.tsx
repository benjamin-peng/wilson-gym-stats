import styled from "styled-components";

const DropdownDiv = styled.div`
    display: flex;
    align-items: center;
    #days-form {
        height: 2em;
    }
`;


const Dropdown = () => {
    return (
        <DropdownDiv>
            <p>Day:&nbsp;</p>
            <select name="days" id="days-form">
                <option value="mon">Monday</option>
                <option value="tues">Tuesday</option>
                <option value="wed">Wednesday</option>
                <option value="thurs">Thursday</option>
                <option value="fri">Friday</option>
            </select>
            <input type="time" id="appt" name="appt" min="09:00" max="18:00" required></input>
        </DropdownDiv>
    );
}
 
export default Dropdown;