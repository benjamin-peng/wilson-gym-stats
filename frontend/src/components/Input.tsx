import styled from "styled-components";
import Dropdown from "./Dropdown";

const InputDiv = styled.div`
    flex-direction: column;
    align-items: center;
`;

const InputText = styled.p`
    font-size: 1.3em;
    margin-bottom: .5em;
`;


const Input = () => {
    return (
        <InputDiv>
            <InputText>Find me the best time to go to the gym on:</InputText>
            <Dropdown></Dropdown>
        </InputDiv>
    );
}
 
export default Input;