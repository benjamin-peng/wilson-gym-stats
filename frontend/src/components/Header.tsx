import styled from "styled-components";
import Duke from '../assets/dukelogo.png'

const HeaderDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MainHeader = styled.p`
    font-size: 2.5rem;
    margin-right: .5em;
`;

const DukeLogo = styled.img`
    height: 3em;
`;


const Header = () => {
    return (
    <HeaderDiv>
        <MainHeader>Duke Wilson Gym Occupancy Tracker</MainHeader>
        <DukeLogo src={Duke}></DukeLogo>
    </HeaderDiv>
    );
}
 
export default Header;