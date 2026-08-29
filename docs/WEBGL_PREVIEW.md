# WebGL 미리보기 배포

`main` 브랜치의 Unity 관련 파일이 변경되면 GitHub Actions가 같은 Unity 프로젝트를 WebGL로 빌드하고 GitHub Pages에 배포합니다.

## 최초 1회 설정

1. Unity Hub에서 Unity Personal 라이선스를 활성화하고 라이선스 파일을 준비합니다.
2. GitHub 저장소의 `Settings > Secrets and variables > Actions`에 다음 Repository secret을 추가합니다.
   - `UNITY_LICENSE`: Unity 라이선스 파일 전체 내용
   - `UNITY_EMAIL`: Unity 계정 이메일
   - `UNITY_PASSWORD`: Unity 계정 비밀번호
3. `Settings > Pages > Build and deployment > Source`를 `GitHub Actions`로 설정합니다.
4. `Actions > Build and deploy WebGL preview > Run workflow`를 실행합니다.

배포 주소는 `https://ming87-star.github.io/office-raid/`입니다. 저장소가 비공개인 경우 사용 중인 GitHub 요금제에서 비공개 저장소의 Pages 게시를 지원해야 하며, 게시된 Pages 사이트 자체는 공개될 수 있습니다.

## 로컬 빌드

Unity 메뉴에서 `OFFICE RAID > Build WebGL Preview`를 선택하면 `build/WebGL`에 같은 결과물이 생성됩니다.
