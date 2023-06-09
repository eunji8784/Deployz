import { useEffect, useState } from "react";
import { theme } from "@/styles/theme";
import styled from "styled-components";
import { alpha, styled as mstyled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import { useRecoilState } from "recoil";
import { itemListState } from "@/recoil/step";
import {
  portValidCheck,
  requestIsDuplicate,
  requestSecretToken,
  requestVersion,
} from "@/api/projectCreate";
import { success, error } from "@components/common/Toast/notify";
import GuidePic from "@/assets/projectCreate/TargetFolder.png";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function ItemBox({
  idx,
  branchList,
}: {
  idx: number;
  branchList: string[];
}) {
  const [itemList, setItemList] = useRecoilState<IItem[]>(itemListState);
  const [item, setItem] = useState<IItem>(defaultItem);
  const [versionList, setVersionList] = useState<string[]>([]);

  // FE, BE 별로 placeholder 결정해주는 함수
  const handlePlaceholder = (value: string) => {
    if (idx === 0) return INPUTFORM[0][value];
    if (idx === 1) return INPUTFORM[1][value];
    else return INPUTFORM[1][value];
  };

  // 컴포넌트 state의 change handler
  const handleItemData = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const id = target.id as string;
    const value = target.value as string;

    setItem((cur) => ({
      ...cur,
      [id]: value,
    }));
  };

  // 컴포넌트 state의 change handler
  const handleSelectChange = (e: SelectChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const id = target.name as string;
    const value = target.value as string;

    // value가 있는 select를 클릭했을때만 하위 version request fetch
    if (id === "frameworkType" && value !== "none") {
      getVersion(value);
    }

    if (id === "branchName") {
      getSercretToken(value);
    }
    setItem((cur) => ({
      ...cur,
      [id]: value,
    }));
  };

  // api를 통한 포트번호 중복 체크
  const handlePortValid = async (port: string) => {
    try {
      const {
        data: { status, message },
      } = await requestIsDuplicate(port);
      if (status === 200) {
        success(`${idx === 0 ? "Frontend" : "Backend"}가 저장되었습니다.`);
        saveInfo();
      } else {
        error(message);
      }
    } catch (err) {
      error("포트 번호의 범위를 확인해주세요.");
    }
  };

  // 각각 아이템 체크
  const itemValidCheck = () => {
    if (
      item.itemName === "" ||
      item.portNumber === "" ||
      item.branchName === "none" ||
      item.targetFolder === "" ||
      item.frameworkType === "none" ||
      item.buildVersion === "none" ||
      (item.frameworkType === "SpringBoot" && item.javaVersion === "none")
    ) {
      error(`${idx === 0 ? "Frontend" : "Backend"}의 모든 값을 입력해주세요.`);
    } else if (portValidCheck(item.portNumber)) {
      error("포트번호는 숫자만 가능합니다.");
    } else {
      handlePortValid(item.portNumber);
    }
  };

  const saveInfo = async () => {
    setItemList((prev: IItem[]) => {
      const newArray = [...prev];
      newArray[idx] = item; // 해당 인덱스의 아이템 수정

      return newArray;
    });
  };

  // itemName같으면 새로 추가하고 다르다면 뒤에 추가
  // const saveInfo = async () => {
  //   // recoil에 local state 저장
  //   setItemList((prev: IItem[]) => {
  //     const index = prev.findIndex(
  //       (prevItem) => prevItem.itemName === item.itemName
  //     );
  //     // 새로 추가
  //     if (index === -1) {
  //       return [...prev, item];
  //     }
  //     // 기존 수정
  //     else {
  //       const newArray = [...prev];
  //       newArray[index] = item;
  //       return newArray;
  //     }
  //   });

  //   console.log(itemList);
  // };

  // bulid type별 버전 api
  const getVersion = async (value: string) => {
    const {
      data: { result },
    } = await requestVersion(value);
    setVersionList(result);
  };

  // 시크릿 토큰 발급
  const getSercretToken = async (value: string) => {
    try {
      const {
        data: { result },
      } = await requestSecretToken(value);

      setItem((cur) => ({
        ...cur,
        secretToken: result,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // recoil에 저장된 이미 사용자가 입력한 값을 띄워주기위한 set
  useEffect(() => {
    itemList.map((item: IItem, index: number) => {
      if (index === idx) {
        setItem(item);
        if (item.frameworkType !== "none") {
          getVersion(item.frameworkType);
        }
      }
    });
  }, []);

  return (
    <>
      <InputContainer>
        <Subject>
          | {idx === 0 && "Front-end"}
          {idx === 1 && "Back-end"}
          {idx > 1 && "Custom"}
        </Subject>
        <SubjectLeft>
          <Desc>
            <ModeIcon sx={{ fontSize: "1.3rem" }} />
            &nbsp;정보 입력 후 저장 필수 *
          </Desc>
          <SaveBtn onClick={() => itemValidCheck()}>저장</SaveBtn>
        </SubjectLeft>
      </InputContainer>
      <Container>
        {/* 첫번째 줄 */}
        <InputContainer>
          <CustomFormControl variant="standard">
            <CustomInputLabel shrink>
              Item Name <RequiredMark>*</RequiredMark>
            </CustomInputLabel>
            <InputBox
              placeholder={`아이템 명을 입력세요. ex) ${handlePlaceholder(
                "ItemName"
              )}`}
              id="itemName"
              value={item.itemName}
              onChange={handleItemData}
            />
          </CustomFormControl>
          <CustomFormControl variant="standard">
            <CustomInputLabel shrink>
              Port Number 1<RequiredMark>*</RequiredMark>
            </CustomInputLabel>
            <InputBox
              placeholder={`ex) ${handlePlaceholder("Port1")}`}
              id="portNumber"
              value={item.portNumber}
              onChange={handleItemData}
            />
          </CustomFormControl>
          <CustomFormControl variant="standard">
            <CustomInputLabel shrink sx={{ color: "darkGrey" }}>
              Port Number 2
            </CustomInputLabel>
            <InputBox
              placeholder={`Available Soon...`}
              id="portNumber2"
              disabled
            />
          </CustomFormControl>
        </InputContainer>
        {/* 2번째 줄 */}
        <InputContainer>
          <CustomFormControl variant="standard">
            <CustomInputLabel shrink>
              Branch Name<RequiredMark>*</RequiredMark>
            </CustomInputLabel>
            <CustomSelect
              name="branchName"
              defaultValue={"none"}
              value={item.branchName}
              onChange={handleSelectChange}
            >
              <MenuItem value="none" sx={{ fontSize: "1.4rem" }}>
                <em>선택하세요.</em>
              </MenuItem>
              {branchList.map((branch, idx) => (
                <MenuItem key={idx} value={branch} sx={{ fontSize: "1.4rem" }}>
                  {branch}
                </MenuItem>
              ))}
            </CustomSelect>
          </CustomFormControl>
          <CustomFormControl variant="standard">
            <CustomInputLabel shrink>
              Target Folder<RequiredMark>*</RequiredMark>
              <CustomTooltip
                disableFocusListener
                arrow
                placement="right"
                title={
                  <>
                    <img
                      src={GuidePic}
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
                      빌드할 소스가 있는 루트 폴더 경로를 적어주세요.
                    </span>
                  </>
                }
              >
                <HelpOutlineIcon
                  sx={{
                    fontSize: "2.6rem",
                    marginLeft: "0.5rem",
                    color: `${theme.colors.secondary}`,
                    cursor: "pointer",
                  }}
                />
              </CustomTooltip>
            </CustomInputLabel>
            <InputBox
              placeholder={`ex) ${handlePlaceholder("TargetFolder")}`}
              id="targetFolder"
              value={item.targetFolder}
              onChange={handleItemData}
            />
          </CustomFormControl>
          <CustomFormControl sx={{ visibility: "hidden" }}>
            <InputLabel>EMPTY</InputLabel>
            <Select
              sx={{
                width: "28.5rem",
              }}
            />
          </CustomFormControl>
        </InputContainer>

        {/* 3번째 줄 */}
        <InputContainer>
          <CustomFormControl variant="standard">
            <CustomInputLabel shrink>
              Build Type<RequiredMark>*</RequiredMark>
            </CustomInputLabel>
            <CustomSelect
              name="frameworkType"
              value={item.frameworkType}
              onChange={handleSelectChange}
            >
              <MenuItem value="none" sx={{ fontSize: "1.4rem" }}>
                <em>선택하세요.</em>
              </MenuItem>
              <MenuItem
                value={handlePlaceholder("Framework")}
                sx={{ fontSize: "1.4rem" }}
              >
                {handlePlaceholder("Framework")}
              </MenuItem>
            </CustomSelect>
          </CustomFormControl>
          <CustomFormControl variant="standard">
            <CustomInputLabel shrink>
              Build Version<RequiredMark>*</RequiredMark>
            </CustomInputLabel>
            <CustomSelect
              name="buildVersion"
              value={item.buildVersion}
              onChange={handleSelectChange}
              MenuProps={{
                style: {
                  maxHeight: "300px",
                },
              }}
            >
              <MenuItem value="none" sx={{ fontSize: "1.4rem" }}>
                <em>선택하세요.</em>
              </MenuItem>
              {versionList.map((version, idx) => (
                <MenuItem key={idx} value={version} sx={{ fontSize: "1.4rem" }}>
                  {version}
                </MenuItem>
              ))}
            </CustomSelect>
          </CustomFormControl>
          {/* Springboot 사용시에만 Java Version 보이게 */}
          {item.frameworkType === "SpringBoot" ? (
            <CustomFormControl variant="standard">
              <CustomInputLabel shrink>
                Java Version<RequiredMark>*</RequiredMark>
              </CustomInputLabel>
              <CustomSelect
                name="javaVersion"
                value={item.javaVersion}
                onChange={handleSelectChange}
                MenuProps={{
                  style: {
                    maxHeight: "300px",
                  },
                }}
              >
                <MenuItem value="none" sx={{ fontSize: "1.4rem" }}>
                  <em>선택하세요.</em>
                </MenuItem>
                {javaVersionList.map((version, idx) => (
                  <MenuItem
                    key={idx}
                    value={version}
                    sx={{ fontSize: "1.4rem" }}
                  >
                    {version}
                  </MenuItem>
                ))}
              </CustomSelect>
            </CustomFormControl>
          ) : (
            <CustomFormControl sx={{ visibility: "hidden" }}>
              <InputLabel>EMPTY</InputLabel>
              <Select
                sx={{
                  width: "28.5rem",
                }}
              />
            </CustomFormControl>
          )}
        </InputContainer>
      </Container>
    </>
  );
}

const RequiredMark = styled.strong`
  color: red;
  font-size: 1.8rem;
  margin-left: 0.2rem;
`;

const CustomSelect = mstyled(Select)({
  fontSize: "1.4rem",
  padding: "0.7rem 0",
  marginLeft: "0.5rem",
});

const CustomInputLabel = mstyled(InputLabel)({
  fontSize: "2.2rem",
  color: "#151649",
  fontFamily: "Pretendard",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
});

const CustomFormControl = mstyled(FormControl)({
  marginRight: "1rem",
  width: "31%",
});

const InputBox = mstyled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    border: "1px solid #ced4da",
    fontSize: 14,
    width: "26rem",
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "background-color"]),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const Container = styled.div`
  background-color: ${theme.colors.container};
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  margin-bottom: 4%;
`;

const Subject = styled.p`
  font-weight: bold;
  margin: 0;
  margin-bottom: 0.7%;
  font-size: 2.5rem;
`;
const SaveBtn = styled.div`
  width: 10rem;
  background-size: 300% 100%;
  background-image: linear-gradient(
    to right,
    #eb3941,
    #f15e64,
    #f7186a,
    #fbb03b
  );
  box-shadow: 0 3px 5px rgba(242, 97, 103, 0.75);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  border-radius: 3rem;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
  :hover {
    transform: scale(1.03);
    transition: all 0.4s ease-in-out;
    background-position: 100% 0;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2%;
`;
const Desc = styled.div`
  font-size: 1.3rem;
  color: ${theme.colors.error};
  display: flex;
  align-items: end;
  margin: 0 1rem;
`;
const SubjectLeft = styled.div`
  display: flex;
  flex-direction: row;
`;

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#151649",
    fontFamily: "Pretendard",
    maxWidth: 220,
    padding: "1.2rem",
  },
  [`& .${tooltipClasses.arrow}`]: {
    fontSize: "2rem",
    color: "#151649",
  },
}));

interface InputForm {
  [key: string]: string | number;
}

const INPUTFORM: InputForm[] = [
  {
    ItemName: "FE",
    Port1: 3000,
    Port2: 3001,
    BranchName: "fe-develop",
    TargetFolder: "/frontend",
    Framework: "React",
  },
  {
    ItemName: "BE",
    Port1: 8081,
    Port2: 8082,
    BranchName: "be-develop",
    TargetFolder: "/backend",
    Framework: "SpringBoot",
  },
];

const defaultItem: IItem = {
  itemName: "",
  portNumber: "",
  branchName: "",
  secretToken: "",
  targetFolder: "",
  frameworkType: "",
  buildVersion: "",
  javaVersion: "",
};

const javaVersionList: string[] = [
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
];
