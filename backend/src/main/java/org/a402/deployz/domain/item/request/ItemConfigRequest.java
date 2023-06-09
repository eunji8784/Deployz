package org.a402.deployz.domain.item.request;

import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.a402.deployz.domain.item.entity.Item;
import org.a402.deployz.domain.project.entity.Project;

@Getter
@AllArgsConstructor
public class ItemConfigRequest {

  @NotNull
  @Schema(description = "아이템 이름")
  private String itemName;

  @NotNull
  @Schema(description = "포트 번호")
  private Long portNumber;

  @NotNull
  @Schema(description = "브랜치 이름")
  private String branchName;

  @NotNull
  @Schema(description = "시크릿 토큰")
  private String secretToken;

  @NotNull
  @Schema(description = "타겟 폴더")
  private String targetFolder;

  @NotNull
  @Schema(description = "프레임워크 종류")
  private String frameworkType;

  @NotNull
  @Schema(description = "빌드 버전")
  private String buildVersion;

  @NotNull
  @Schema(description = "자바 버전")
  private String javaVersion;

  public Item toEntity(Project project) {
    return Item.builder()
        .name(itemName)
        .portNumber(portNumber)
        .branchName(branchName)
        .targetFolderPath(targetFolder)
        .frameworkType(frameworkType)
        .buildVersion(buildVersion)
        .javaVersion(javaVersion)
        .project(project)
        .build();
  }

}
