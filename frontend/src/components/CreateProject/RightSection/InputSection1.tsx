import { theme } from "@/styles/theme";
import styled from "styled-components";
import { FormControl, InputBase, InputLabel } from "@mui/material";
import { alpha, styled as mstyled } from "@mui/material/styles";
import { useRecoilState, useRecoilValue } from "recoil";
import { chapterState, projectConfigState, stepState } from "@/recoil/step";
import { useEffect, useState } from "react";
import { requestGitlabInfo } from "@/api/projectCreate";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ProjectIDIMG from "@/assets/projectCreate/ProjectID.png";

export default function InputSection1() {
  const [projectConfig, setProjectConfig] =
    useRecoilState<IProjectConfig>(projectConfigState);
  const [repoInfo, setRepoInfo] = useState<IProjectInfoById>(INIT_PROJECTINFO);
  const nowChapter = useRecoilValue(chapterState);
  const [steps, setSteps] = useRecoilState(stepState);

  useEffect(() => {
    checkIsValid();
  }, [projectConfig]);

  // 스텝 바꿀때 체크
  const checkIsValid = () => {
    if (
      projectConfig.hostUrl === "" ||
      projectConfig.projectId === "" ||
      projectConfig.projectName === "" ||
      // projectConfig.description === "" ||
      repoInfo.name === "none"
    ) {
      const updatedSteps = steps.map((step) => {
        if (step.number === nowChapter) {
          return { ...step, isValid: false };
        } else {
          return step;
        }
      });

      setSteps(updatedSteps);
    } else {
      const updatedSteps = steps.map((step) => {
        if (step.number === nowChapter) {
          return { ...step, isValid: true };
        } else {
          return step;
        }
      });

      setSteps(updatedSteps);
    }
  };

  // 컴포넌트 state의 change handler
  const handleItemData = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const id = target.id as string;
    const value = target.value as string;

    setProjectConfig((cur) => ({
      ...cur,
      [id]: value,
    }));
  };

  /**
   *
   * @param value UTC기준 시간 string으로 입력
   * @returns '년 월 일'로 리턴
   */
  const timeTransfrom = (value: string) => {
    if (value === "") return "";
    // 문자열에서 Date 객체 생성
    const ts = new Date(value);

    // 한국 표준시로 변환
    const korOffset = 9 * 60; // 한국 표준시는 UTC+9
    const korTs = new Date(
      ts.getTime() + (korOffset + ts.getTimezoneOffset()) * 60000
    );

    // 년, 월, 일, 시, 분 구하기
    const year = korTs.getFullYear();
    const month = korTs.getMonth() + 1;
    const date = korTs.getDate();
    const hour = korTs.getHours();
    const minute = korTs.getMinutes();
    return `${year}년 ${month}월 ${date}일 ${hour}시 ${minute}분`;
  };

  // 레포 정보저장
  const getGitlabInfo = async () => {
    try {
      const { data } = await requestGitlabInfo(
        projectConfig.hostUrl,
        projectConfig.projectId
      );
      setRepoInfo({
        name: data.name,
        path: data.name_with_namespace,
        description: data.description,
        deafultBranch: data.default_branch,
        createdAt: data.created_at,
        lastActivityAt: data.last_activity_at,
      });
      setProjectConfig((cur) => ({
        ...cur,
        repositoryUrl: data.http_url_to_repo,
      }));
    } catch (error) {
      setProjectConfig((cur) => ({
        ...cur,
        repositoryUrl: "",
      }));
      setRepoInfo(NONE_PROJECTINFO);
    }
  };

  useEffect(() => {
    getGitlabInfo();
  }, [projectConfig.projectId, projectConfig.hostUrl]);

  return (
    <Container>
      {/* <p className="subject">Project 설정 정보 입력</p> */}
      {/* 첫째 줄 */}
      <InputContainer>
        <CustomFormControl variant="standard" sx={{ marginRight: "1rem" }}>
          <CustomInputLabel shrink>
            Repository Host URL <RequiredMark>*</RequiredMark>
          </CustomInputLabel>
          <InputBox
            widthnum={"30rem"}
            fontnum={"1.4rem"}
            spacingnum={4}
            placeholder={`ex) https://lab.ssafy.com`}
            id="hostUrl"
            value={projectConfig.hostUrl}
            onChange={handleItemData}
          />
        </CustomFormControl>
        <CustomFormControl variant="standard">
          <CustomInputLabel shrink>
            Repository Project ID<RequiredMark>*</RequiredMark>
            <CustomTooltip
              disableFocusListener
              arrow
              placement="bottom"
              title={
                <>
                  <img
                    src={ProjectIDIMG}
                    style={{
                      borderRadius: "5px",
                      width: "100%",
                      marginBottom: "1rem",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontFamily: "Pretendard",
                    }}
                  >
                    레포지토리 상세 정보의 프로젝트 이름 하단에서 확인할 수
                    있어요.
                  </span>
                </>
              }
            >
              <HelpOutlineIcon
                sx={{
                  fontSize: "3rem",
                  marginLeft: "1rem",
                  color: `${theme.colors.secondary}`,
                  cursor: "pointer",
                }}
              />
            </CustomTooltip>
          </CustomInputLabel>
          <InputBox
            widthnum={"30rem"}
            fontnum={"1.4rem"}
            spacingnum={4}
            placeholder={`해당 레포지토리의 project id를 입력하세요.`}
            id="projectId"
            value={projectConfig.projectId}
            onChange={handleItemData}
          />
        </CustomFormControl>
      </InputContainer>

      {/* 둘째 줄 */}
      <InputContainer>
        <CustomFormControl variant="standard">
          <CustomInputLabel shrink>
            Project Name<RequiredMark>*</RequiredMark>
          </CustomInputLabel>
          <InputBox
            widthnum={"30rem"}
            fontnum={"1.4rem"}
            spacingnum={4}
            placeholder={`프로젝트 이름을 입력하세요.`}
            id="projectName"
            value={projectConfig.projectName}
            onChange={handleItemData}
          />
        </CustomFormControl>
        <CustomFormControl variant="standard">
          <CustomInputLabel shrink>Project Description</CustomInputLabel>
          <InputBox
            widthnum={"30rem"}
            fontnum={"1.4rem"}
            spacingnum={4}
            placeholder={`프로젝트 설명을 입력하세요.`}
            id="description"
            value={projectConfig.description}
            onChange={handleItemData}
          />
        </CustomFormControl>
      </InputContainer>
      {projectConfig.projectId == "" ? (
        <ProjectContainer className="none">
          레포지토리의 Host URL과 Project ID를 입력하세요.
        </ProjectContainer>
      ) : (
        <>
          {repoInfo.name !== "none" && (
            <ProjectContainer>
              <p>
                <b>프로젝트명</b> : {repoInfo.name}
              </p>
              <p>
                <b>프로젝트 소개</b> : {repoInfo.description}
              </p>
              <p>
                <b>프로젝트 경로</b> : {repoInfo.path}
              </p>
              <p>
                <b>기본 브랜치</b> : {repoInfo.deafultBranch}
              </p>
              <p>
                <b>생성 일자</b> : {timeTransfrom(repoInfo.createdAt)}
              </p>
              <p>
                <b>마지막 활동 일자</b> :
                {timeTransfrom(repoInfo.lastActivityAt)}
              </p>
            </ProjectContainer>
          )}
          {repoInfo.name === "none" && (
            <ProjectContainer className="none">
              <p>😥</p>
              존재하지않거나, 접근 권한이 없는 레포지토리입니다.
            </ProjectContainer>
          )}
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  /* background-color: ${theme.colors.container}; */
  flex: 4;
  margin: 2rem 1.5rem;
  border-radius: 1rem;
  padding: 2.5rem;
  color: ${theme.colors.primary};

  .none {
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 2.6rem;

    p {
      font-size: 3rem;
    }
  }

  .subject {
    font-size: 3.7rem;
    margin-top: 0;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const RequiredMark = styled.strong`
  color: red;
  font-size: 2.4rem;
  margin-left: 0.2rem;
`;

const CustomInputLabel = mstyled(InputLabel)({
  fontSize: "2.8rem",
  fontWeight: "700",
  color: "#151649",
  fontFamily: "Pretendard",
  display: "flex",
  alignItems: "center",
});

const CustomFormControl = mstyled(FormControl)({
  marginRight: "1rem",
});

const InputBox = mstyled(InputBase)<{
  widthnum: string;
  fontnum: string;
  spacingnum: number;
}>(
  ({
    theme,
    widthnum: widthnum,
    fontnum: fontnum,
    spacingnum: spacingnum,
  }) => ({
    "label + &": {
      marginTop: theme.spacing(spacingnum),
    },
    "& .MuiInputBase-input": {
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
      border: "1px solid #ced4da",
      fontSize: fontnum,
      width: widthnum,
      padding: "10px 12px",
      transition: theme.transitions.create([
        "border-color",
        "background-color",
      ]),
      "&:focus": {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
      // 글꼴 설정 추가
      fontFamily: "Pretendard",
    },
  })
);

const InputContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 3%;
`;

const ProjectContainer = styled.div`
  width: 80%;
  height: 55%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${theme.colors.container};
  border-radius: 1rem;
  padding: 1rem 2rem;

  p {
    font-size: 1.8rem;
    margin: 1rem 0;
  }
`;

const INIT_PROJECTINFO: IProjectInfoById = {
  name: "",
  path: "",
  description: "",
  deafultBranch: "",
  createdAt: "",
  lastActivityAt: "",
};

const NONE_PROJECTINFO: IProjectInfoById = {
  name: "none",
  path: "",
  description: "",
  deafultBranch: "",
  createdAt: "",
  lastActivityAt: "",
};

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#151649",
    fontFamily: "Pretendard",
    maxWidth: 280,
    padding: "1.2rem",
  },
  [`& .${tooltipClasses.arrow}`]: {
    fontSize: "2rem",
    color: "#151649",
  },
}));
