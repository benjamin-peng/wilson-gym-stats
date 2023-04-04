import styled from "styled-components";
import Duke from '.,/assets/dukelogo.png'

const HeaderDiv = styled.div`
    
`;

const MainHeader = styled.p`
  font-size: 2.5rem;
`;


const Header = () => {
    return (
    <HeaderDiv>
        <MainHeader>Duke Wilson Gym Occupancy Tracker</MainHeader>
    </HeaderDiv>
    );
}
 
export default Header;