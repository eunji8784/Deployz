import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { color, motion } from "framer-motion";
import { theme } from "@/styles/theme";
import LandingPic from "@/assets/landing.png";
import Modal from "@mui/material/Modal";
import InfraGuideModal from "@components/Guide/InfraGuideModal";

export default function Landing1() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  return (
    <Container>
      <TitleContainer>
      <Title>
        그동안
        <span style={{ fontWeight: `${theme.fontWeight.extrabold}` }}>
          &nbsp;'인프라'&nbsp;
        </span>
        너무 어려우셨나요?
      </Title>
      <Title> 배포를 쉽게, <span style={{ fontWeight: `${theme.fontWeight.extrabold}`, }}>
          &nbsp;DeployZ &nbsp;
        </span></Title>
      {/* <Title>
        
        = Depoly + easy
      </Title> */}
      </TitleContainer>
      <div className="btn-container">
        {/* <Guidebtn onClick={handleOpen}>Infra Guide</Guidebtn>
        <Modal open={open} onClose={handleClose}>
          <>
            <InfraGuideModal handleClose={handleClose} />
          </>
        </Modal> */}
        <Guidebtn onClick={() => navigate("/intro")}>Start</Guidebtn>
      </div>
      <ImgPage alt="logo" src={LandingPic}/>
      <Underbar></Underbar>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Svg
          id="svg"
          viewBox="0 0 1440 300"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "fixed", bottom: 0, left: 0 }}
          preserveAspectRatio="none"
        >
          <path
            d="M 0,400 C 0,400 0,200 0,200 C 52.417038818275515,195.67777396083818 1362.7097217451048,183.33631054620406 1440,200 C 1440,200 1440,400 1440,400 Z"
            stroke="none"
            strokeWidth="0"
            fill="#ffffff"
            fillOpacity="1"
            className="path-0"
          ></path>
        </Svg>
      </motion.div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${theme.colors.primary};
  .btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5%;
  }
`;
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 15rem;
`
const Title = styled.div`
  color: ${theme.colors.white};
  font-size: 4rem;
  padding : 1rem;
`;
const Guidebtn = styled.div`
  border-radius: 15rem;
  background: ${theme.colors.white};
  color: ${theme.colors.primary};
  padding: 1.1rem 7rem;
  font-size: 2.5rem;
  margin-top: 6rem;
  font-weight: 700;
  :hover {
    background: ${theme.colors.secondary};
    color: ${theme.colors.white};
    transition: all 0.4s ease-out;
    cursor: pointer;
  }
`;
const ImgPage = styled.img`
  height: 30vh;
  z-index: 2;
  position: relative;
  top: 3vh
`
const Underbar = styled.div`
  width : 60vh;
  height : 5vh;
  border-radius : 5rem;
  background: #fff;
  box-shadow: 1px 2px 4px #474747;
  z-index: 1;
`
const animatePath = keyframes`
  0% {
    d: path("M 0,400 C 0,400 0,200 0,200 C 52.417038818275515,195.67777396083818 104.83407763655103,191.3555479216764 170,177 C 235.16592236344897,162.6444520783236 313.08072827207144,138.25558227413262 393,167 C 472.91927172792856,195.74441772586738 554.8430092751631,277.62212298179315 629,267 C 703.1569907248369,256.37787701820685 769.547234627276,153.25592579869465 826,126 C 882.452765372724,98.74407420130537 928.9680522157335,147.35417382342837 991,164 C 1053.0319477842665,180.64582617657163 1130.5805565097903,165.32737890759188 1208,166 C 1285.4194434902097,166.67262109240812 1362.7097217451048,183.33631054620406 1440,200 C 1440,200 1440,400 1440,400 Z");
  }
  25% {
    d: path("M 0,400 C 0,400 0,200 0,200 C 59.68601855032637,162.63483339058743 119.37203710065273,125.26966678117486 190,140 C 260.62796289934727,154.73033321882514 342.19787014771543,221.55616626588804 410,227 C 477.80212985228457,232.44383373411196 531.8364823084852,176.5056681552731 602,169 C 672.1635176915148,161.4943318447269 758.4562006183443,202.4211611130196 838,213 C 917.5437993816557,223.5788388869804 990.3387152181381,203.80968739264858 1054,204 C 1117.661284781862,204.19031260735142 1172.1889385091033,224.34008931638613 1235,227 C 1297.8110614908967,229.65991068361387 1368.9055307454482,214.82995534180694 1440,200 C 1440,200 1440,400 1440,400 Z");
  }
  50% {
    d: path("M 0,400 C 0,400 0,200 0,200 C 72.19787014771558,206.1614565441429 144.39574029543115,212.32291308828582 206,221 C 267.60425970456885,229.67708691171418 318.61490896599105,240.86980419099964 387,244 C 455.38509103400895,247.13019580900036 541.1446238406047,242.19787014771555 609,219 C 676.8553761593953,195.80212985228445 726.8065956715906,154.33871521813808 805,132 C 883.1934043284094,109.66128478186191 989.6289934730332,106.44726897973206 1061,128 C 1132.3710065269668,149.55273102026794 1168.677430436276,195.8722088629337 1226,212 C 1283.322569563724,228.1277911370663 1361.661284781862,214.06389556853316 1440,200 C 1440,200 1440,400 1440,400 Z");
  }
  75% {
    d: path("M 0,400 C 0,400 0,200 0,200 C 62.23222260391617,212.31879079354172 124.46444520783234,224.63758158708347 201,212 C 277.53555479216766,199.36241841291653 368.3744417725868,161.76846444520785 446,168 C 523.6255582274132,174.23153555479215 588.0377877018205,224.2885606320852 644,228 C 699.9622122981795,231.7114393679148 747.4744074201305,189.0772930264514 800,194 C 852.5255925798695,198.9227069735486 910.0645826176572,251.40226726210926 991,244 C 1071.9354173823428,236.59773273789074 1176.2672621092408,169.31363792511164 1255,152 C 1333.7327378907592,134.68636207488836 1386.8663689453797,167.3431810374442 1440,200 C 1440,200 1440,400 1440,400 Z");
  }
  100% {
    d: path("M 0,400 C 0,400 0,200 0,200 C 52.417038818275515,195.67777396083818 104.83407763655103,191.3555479216764 170,177 C 235.16592236344897,162.6444520783236 313.08072827207144,138.25558227413262 393,167 C 472.91927172792856,195.74441772586738 554.8430092751631,277.62212298179315 629,267 C 703.1569907248369,256.37787701820685 769.547234627276,153.25592579869465 826,126 C 882.452765372724,98.74407420130537 928.9680522157335,147.35417382342837 991,164 C 1053.0319477842665,180.64582617657163 1130.5805565097903,165.32737890759188 1208,166 C 1285.4194434902097,166.67262109240812 1362.7097217451048,183.33631054620406 1440,200 C 1440,200 1440,400 1440,400 Z");
  }
  `;

const Svg = styled.svg`
  /* z-index: 0; */
  width: 100%;
  transition: all 300ms ease-in-out 150ms;
  .path-0 {
    animation: ${animatePath} 10s linear infinite;
  }
`;