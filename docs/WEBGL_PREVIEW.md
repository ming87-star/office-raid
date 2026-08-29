# 웹 미리보기 배포

모바일에서 설치 없이 개발 상황을 확인할 수 있도록 `web/`에 브라우저 프로토타입을 제공합니다. 회사 생성, 면접과 채용, 3인 팀 편성, 프로젝트 자동 전투를 실행할 수 있으며 Unity 라이선스나 계정 비밀번호가 필요하지 않습니다.

`web/`이 변경되면 `Deploy live web preview` GitHub Actions가 `https://ming87-star.github.io/office-raid/`에 자동 배포합니다.

## 최초 1회 Pages 설정

저장소의 `Settings > Pages > Build and deployment > Source`를 `GitHub Actions`로 설정합니다. 이후에는 코드가 갱신될 때마다 자동 배포됩니다.

## 선택적 Unity WebGL 빌드

Unity 프로젝트 자체의 WebGL 빌드가 필요할 때는 `Build and deploy WebGL preview`를 수동 실행합니다. 이 작업은 GameCI의 Unity Personal 활성화 방식 때문에 로컬 Unity Hub에서 생성한 라이선스와 Unity 비밀번호가 필요합니다.

1. Unity Hub에서 Unity Personal 라이선스를 활성화하고 라이선스 파일을 준비합니다.
2. GitHub 저장소의 `Settings > Secrets and variables > Actions`에 다음 Repository secret을 추가합니다.
   - `UNITY_LICENSE`: Unity 라이선스 파일 전체 내용
   - `UNITY_EMAIL`: Unity 계정 이메일
   - `UNITY_PASSWORD`: Unity 계정 비밀번호
3. `Actions > Build and deploy WebGL preview > Run workflow`를 실행합니다.

Unity 계정을 Google로만 로그인해 별도 비밀번호가 없다면 브라우저 프로토타입을 사용합니다. Unity 프로젝트와 게임 규칙은 계속 함께 유지합니다.

## 로컬 빌드

Unity 메뉴에서 `OFFICE RAID > Build WebGL Preview`를 선택하면 `build/WebGL`에 같은 결과물이 생성됩니다.
