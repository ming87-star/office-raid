using System;
using System.Collections.Generic;
using System.Linq;
using OfficeRaid.Core;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace OfficeRaid.Runtime
{
    public sealed class OfficeRaidPrototypeBehaviour : MonoBehaviour
    {
        private enum View { Opening, CompanySetup, RepresentativeSetup, Office, Interview, TeamSelection, Equipment, Battle }

        private static readonly Color Ink = Hex("17364A");
        private static readonly Color Paper = Hex("F3EBD7");
        private static readonly Color PaperDark = Hex("D8CEB8");
        private static readonly Color Teal = Hex("168C8B");
        private static readonly Color Mustard = Hex("D6A12C");
        private static readonly Color Red = Hex("C84B3C");
        private static readonly Color Blue = Hex("4A70A8");
        private static readonly Color Panel = Hex("FFF9E9");
        private static readonly string[] CompanyPrefixes = { "반짝", "단단", "빠른", "작은", "푸른", "새벽", "모아", "한걸음" };
        private static readonly string[] CompanySuffixes = { "랩", "스튜디오", "웍스", "컴퍼니", "프로젝트", "오피스", "팩토리", "파트너스" };
        private static readonly string[] RepresentativeFamilyNames = { "김", "이", "박", "최", "정", "강", "조", "윤" };
        private static readonly string[] RepresentativeGivenNames = { "민준", "서연", "지우", "도윤", "하린", "현우", "유진", "수빈" };

        private OfficeRaidGame game;
        private View currentView;
        private int openingPage;
        private string companyName = "오피스 레이드 주식회사";
        private string representativeName = "서대표";
        private AppearanceProfile representativeAppearance = new AppearanceProfile { Face = 1, Skin = 2, Hair = 3, Eyes = 2, Eyebrows = 1, Nose = 2, Mouth = 1, Accessory = 0, Outfit = 0 };
        private string notice = "회사 이름을 정하고 작은 회사를 시작하세요.";
        private List<Candidate> candidates = new List<Candidate>();
        private List<string> teamDraft = new List<string>();
        private string equipmentEmployeeId;
        private Font font;
        private RectTransform screenRoot;
        private InputField companyNameInput;
        private InputField representativeNameInput;
        private readonly System.Random setupRandom = new System.Random();
        private bool representativeDetailMode;
        private Text battleTitle;
        private Text battleDeadline;
        private Text battleWorkload;
        private Text battleLog;
        private Text battleStatus;
        private Image battleWorkFill;
        private GameObject battleResult;
        private Text battleResultText;
        private RectTransform salesEffect;
        private RectTransform developerEffect;
        private float battleTimer;
        private float attackAnimation;
        private bool resultClaimed;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (FindFirstObjectByType<OfficeRaidPrototypeBehaviour>() != null) return;
            var root = new GameObject("OfficeRaidPrototype");
            DontDestroyOnLoad(root);
            root.AddComponent<OfficeRaidPrototypeBehaviour>();
        }

        private void Awake()
        {
            game = new OfficeRaidGame();
            font = Font.CreateDynamicFontFromOSFont(
                new[] { "Malgun Gothic", "Noto Sans CJK KR", "Apple SD Gothic Neo", "Arial" }, 24);
            if (font == null) font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            EnsureEventSystem();
            BuildCanvas();
            ShowOpening();
        }

        private void Update()
        {
            AnimateAttackEffects();
            if (currentView != View.Battle || game.CurrentBattle == null || game.CurrentBattle.IsComplete) return;

            battleTimer += Time.deltaTime;
            if (battleTimer < 0.85f) return;
            battleTimer = 0f;
            attackAnimation = 0f;
            game.CurrentBattle.Step();
            RefreshBattle();
        }

        private void BuildCanvas()
        {
            var canvasObject = new GameObject("PortraitCanvas", typeof(RectTransform), typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            canvasObject.transform.SetParent(transform, false);
            var canvas = canvasObject.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.pixelPerfect = true;
            var scaler = canvasObject.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(360f, 780f);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;

            var safeRoot = CreateRect(canvasObject.transform, "SafeArea");
            Stretch(safeRoot);
            safeRoot.gameObject.AddComponent<SafeAreaFitter>();
            screenRoot = CreateRect(safeRoot, "Screen");
            Stretch(screenRoot);
        }

        private void ShowOpening()
        {
            currentView = View.Opening;
            ClearScreen();
            CreateBackground();
            CreateText(screenRoot, "OpeningBrand", "OFFICE RAID", 16, FontStyle.Bold, Teal,
                new Vector2(0.06f, 0.92f), new Vector2(0.56f, 0.98f), TextAnchor.MiddleLeft);
            CreateButton(screenRoot, "건너뛰기", PaperDark, Ink, new Vector2(0.72f, 0.92f), new Vector2(0.95f, 0.98f), ShowCompanySetup);

            var card = CreatePanel(screenRoot, "OpeningCard", Panel, new Vector2(0.06f, 0.20f), new Vector2(0.94f, 0.90f));
            AddOutline(card.gameObject, Ink, new Vector2(3f, -3f));
            if (openingPage == 0)
            {
                CreateText(card, "Kicker", "창업 첫날 · 오전 8:57", 13, FontStyle.Bold, Mustard,
                    new Vector2(0.07f, 0.84f), new Vector2(0.93f, 0.94f), TextAnchor.MiddleLeft);
                CreateText(card, "Title", "책상은 세 개.\n회사 이름은 아직 없다.", 25, FontStyle.Bold, Ink,
                    new Vector2(0.07f, 0.66f), new Vector2(0.93f, 0.84f), TextAnchor.MiddleLeft);
                var room = CreatePanel(card, "EmptyOffice", PaperDark, new Vector2(0.07f, 0.10f), new Vector2(0.93f, 0.61f));
                AddOutline(room.gameObject, Ink, new Vector2(2f, -2f));
                CreateOpeningOffice(room);
            }
            else if (openingPage == 1)
            {
                CreateText(card, "Kicker", "띵! · 새 메일 1", 13, FontStyle.Bold, Mustard,
                    new Vector2(0.07f, 0.84f), new Vector2(0.93f, 0.94f), TextAnchor.MiddleLeft);
                CreateText(card, "Title", "첫 프로젝트가\n도착했다.", 27, FontStyle.Bold, Ink,
                    new Vector2(0.07f, 0.66f), new Vector2(0.93f, 0.84f), TextAnchor.MiddleLeft);
                var mail = CreatePanel(card, "MailWindow", Color.white, new Vector2(0.07f, 0.07f), new Vector2(0.93f, 0.63f));
                AddOutline(mail.gameObject, Ink, new Vector2(2f, -2f));
                var mailBar = CreatePanel(mail, "MailBar", Ink, new Vector2(0f, 0.86f), Vector2.one);
                CreateText(mailBar, "MailLabel", "MAIL · 받은편지함", 11, FontStyle.Bold, Color.white,
                    new Vector2(0.04f, 0f), new Vector2(0.70f, 1f), TextAnchor.MiddleLeft);
                CreateText(mailBar, "MailTime", "오전 8:57", 10, FontStyle.Bold, Mustard,
                    new Vector2(0.70f, 0f), new Vector2(0.96f, 1f), TextAnchor.MiddleRight);
                CreateText(mail, "From", "대형 고객사  <project@bigclient.co.kr>", 10, FontStyle.Bold, Teal,
                    new Vector2(0.05f, 0.73f), new Vector2(0.95f, 0.86f), TextAnchor.MiddleLeft);
                CreateText(mail, "Subject", "제목 · 긴급 프로젝트 의뢰드립니다", 13, FontStyle.Bold, Ink,
                    new Vector2(0.05f, 0.58f), new Vector2(0.95f, 0.73f), TextAnchor.MiddleLeft);
                CreateText(mail, "Body", "안녕하세요, 대표님.\n첨부 프로젝트를 검토 부탁드립니다.\n오늘 안에 가능하시죠?", 12, FontStyle.Normal, Ink,
                    new Vector2(0.05f, 0.30f), new Vector2(0.95f, 0.58f), TextAnchor.MiddleLeft);
                var attachment = CreatePanel(mail, "Attachment", PaperDark, new Vector2(0.05f, 0.06f), new Vector2(0.95f, 0.28f));
                AddOutline(attachment.gameObject, Ink.WithAlpha(0.6f), new Vector2(1f, -1f));
                CreateSprite(attachment, "AttachmentPreview", PixelArtFactory.ProjectBoss(), new Vector2(0.02f, 0.06f), new Vector2(0.21f, 0.94f));
                CreateText(attachment, "FileName", "project_final_FINAL_v7.zip\n수정사항 47개 · 12.8MB", 10, FontStyle.Bold, Ink,
                    new Vector2(0.23f, 0.06f), new Vector2(0.97f, 0.94f), TextAnchor.MiddleLeft);
            }
            else
            {
                CreateText(card, "Kicker", "수정 요청 47건 · 마감 D-8", 13, FontStyle.Bold, Red,
                    new Vector2(0.07f, 0.84f), new Vector2(0.93f, 0.94f), TextAnchor.MiddleLeft);
                CreateText(card, "Title", "혼자는 무리다.\n하지만 우리는 셋이다.", 25, FontStyle.Bold, Ink,
                    new Vector2(0.07f, 0.66f), new Vector2(0.93f, 0.84f), TextAnchor.MiddleLeft);
                CreateSprite(card, "OpeningBoss", PixelArtFactory.ProjectBoss(), new Vector2(0.34f, 0.38f), new Vector2(0.66f, 0.65f));
                CreateSprite(card, "OpeningPM", PixelArtFactory.EmployeeBack(Department.ProjectManagement), new Vector2(0.09f, 0.09f), new Vector2(0.35f, 0.37f));
                CreateSprite(card, "OpeningDeveloper", PixelArtFactory.EmployeeBack(Department.Development), new Vector2(0.37f, 0.06f), new Vector2(0.63f, 0.34f));
                CreateSprite(card, "OpeningSales", PixelArtFactory.EmployeeBack(Department.Sales), new Vector2(0.65f, 0.09f), new Vector2(0.91f, 0.37f));
            }

            var progress = openingPage == 0 ? "●  ○  ○" : openingPage == 1 ? "○  ●  ○" : "○  ○  ●";
            CreateText(screenRoot, "OpeningProgress", progress, 16, FontStyle.Bold, Teal,
                new Vector2(0.30f, 0.14f), new Vector2(0.70f, 0.20f), TextAnchor.MiddleCenter);
            CreateButton(screenRoot, openingPage < 2 ? "다음" : "회사 이름 정하기", Teal, Color.white,
                new Vector2(0.08f, 0.04f), new Vector2(0.92f, 0.13f), NextOpeningPage);
        }

        private void NextOpeningPage()
        {
            if (openingPage < 2)
            {
                openingPage++;
                ShowOpening();
                return;
            }
            ShowCompanySetup();
        }

        private void ShowCompanySetup()
        {
            currentView = View.CompanySetup;
            ClearScreen();
            CreateBackground();
            CreateText(screenRoot, "Logo", "OFFICE\nRAID", 44, FontStyle.Bold, Ink,
                new Vector2(0.08f, 0.79f), new Vector2(0.92f, 0.94f), TextAnchor.MiddleCenter);
            CreateText(screenRoot, "Tagline", "인재 수집형 오피스 전투 RPG", 15, FontStyle.Bold, Teal,
                new Vector2(0.06f, 0.74f), new Vector2(0.94f, 0.80f), TextAnchor.MiddleCenter);

            var preview = CreatePanel(screenRoot, "SetupStoryPreview", Hex("D9CCB1"), new Vector2(0.10f, 0.53f), new Vector2(0.90f, 0.73f));
            AddOutline(preview.gameObject, Ink, new Vector2(1f, -1f));
            CreateImage(preview, "StageFloor", Ink.WithAlpha(0.13f), new Vector2(0f, 0f), new Vector2(1f, 0.22f));
            var glow = CreateImage(preview, "ProjectGlow", Mustard.WithAlpha(0.30f), new Vector2(0.31f, 0.25f), new Vector2(0.69f, 1f));
            glow.rectTransform.localRotation = Quaternion.Euler(0f, 0f, 45f);
            CreateText(preview, "PreviewLabel", "THE FIRST BIG PROJECT", 8, FontStyle.Bold, Ink.WithAlpha(0.55f),
                new Vector2(0.03f, 0.86f), new Vector2(0.42f, 0.98f), TextAnchor.MiddleLeft);
            var stamp = CreatePanel(preview, "DeadlineStamp", Panel, new Vector2(0.77f, 0.69f), new Vector2(0.96f, 0.94f));
            AddOutline(stamp.gameObject, Red, new Vector2(1f, -1f));
            stamp.localRotation = Quaternion.Euler(0f, 0f, 5f);
            CreateText(stamp, "Deadline", "DEADLINE\nD-8", 11, FontStyle.Bold, Red, Vector2.zero, Vector2.one, TextAnchor.MiddleCenter);
            CreateSprite(preview, "SetupBoss", PixelArtFactory.ProjectBoss(), new Vector2(0.36f, 0.37f), new Vector2(0.64f, 0.98f));
            CreateSprite(preview, "SetupProjectManagement", PixelArtFactory.EmployeeBack(Department.ProjectManagement),
                new Vector2(0.07f, 0.03f), new Vector2(0.33f, 0.43f));
            CreateSprite(preview, "SetupDeveloper", PixelArtFactory.EmployeeBack(Department.Development),
                new Vector2(0.36f, 0.01f), new Vector2(0.64f, 0.45f));
            CreateSprite(preview, "SetupSales", PixelArtFactory.EmployeeBack(Department.Sales),
                new Vector2(0.67f, 0.03f), new Vector2(0.93f, 0.43f));
            CreateStoryPaper(preview, "PaperOne", new Vector2(0.21f, 0.48f), -16f);
            CreateStoryPaper(preview, "PaperTwo", new Vector2(0.73f, 0.55f), 19f);
            CreateStoryPaper(preview, "PaperThree", new Vector2(0.28f, 0.72f), 9f);

            var card = CreatePanel(screenRoot, "CompanyCard", Panel, new Vector2(0.07f, 0.17f), new Vector2(0.93f, 0.51f));
            AddOutline(card.gameObject, Ink, new Vector2(2f, -2f));
            CreateText(card, "Title", "작은 팀, 큰 프로젝트", 22, FontStyle.Bold, Ink,
                new Vector2(0.07f, 0.74f), new Vector2(0.93f, 0.94f), TextAnchor.MiddleLeft);
            CreateText(card, "Label", "회사 이름", 13, FontStyle.Bold, Ink,
                new Vector2(0.07f, 0.59f), new Vector2(0.93f, 0.74f), TextAnchor.MiddleLeft);
            companyNameInput = CreateInputField(card, companyName, new Vector2(0.07f, 0.39f), new Vector2(0.66f, 0.59f));
            CreateButton(card, "랜덤 생성", Mustard, Ink, new Vector2(0.69f, 0.39f), new Vector2(0.93f, 0.59f), RandomizeCompanyName);
            CreateText(card, "Description", "동료를 모아 회사를 키우고\n거대한 프로젝트를 공략하세요.", 13, FontStyle.Normal, Ink,
                new Vector2(0.07f, 0.24f), new Vector2(0.93f, 0.38f), TextAnchor.MiddleLeft);
            CreateButton(card, "다음 · 대표 만들기", Teal, Color.white, new Vector2(0.07f, 0.05f), new Vector2(0.93f, 0.23f), OpenRepresentativeSetup);
        }

        private void RandomizeCompanyName()
        {
            companyName = CompanyPrefixes[setupRandom.Next(CompanyPrefixes.Length)] + " " + CompanySuffixes[setupRandom.Next(CompanySuffixes.Length)];
            if (companyNameInput != null) companyNameInput.text = companyName;
        }

        private void OpenRepresentativeSetup()
        {
            companyName = companyNameInput == null ? companyName : companyNameInput.text;
            ShowRepresentativeSetup();
        }

        private void ShowRepresentativeSetup()
        {
            currentView = View.RepresentativeSetup;
            ClearScreen();
            CreateBackground();
            CreateHeader("대표 만들기", "대표 이름과 모습을 정하세요. 능력치는 외형과 무관합니다.");
            var card = CreatePanel(screenRoot, "RepresentativeCard", Panel, new Vector2(0.06f, 0.16f), new Vector2(0.94f, 0.82f));
            AddOutline(card.gameObject, Ink, new Vector2(2f, -2f));
            CreateSprite(card, "RepresentativePortrait", PixelArtFactory.Portrait(Department.ProjectManagement, representativeAppearance),
                new Vector2(0.31f, 0.66f), new Vector2(0.69f, 0.96f));
            CreateText(card, "NameLabel", "대표 이름", 12, FontStyle.Bold, Ink,
                new Vector2(0.06f, 0.57f), new Vector2(0.54f, 0.65f), TextAnchor.MiddleLeft);
            representativeNameInput = CreateInputField(card, representativeName, new Vector2(0.06f, 0.47f), new Vector2(0.62f, 0.57f));
            CreateButton(card, "이름 랜덤", Mustard, Ink, new Vector2(0.66f, 0.47f), new Vector2(0.94f, 0.57f), RandomizeRepresentativeName);
            CreateButton(card, "전체 랜덤", Blue, Color.white, new Vector2(0.66f, 0.59f), new Vector2(0.94f, 0.66f), RandomizeRepresentativeAppearance);
            CreateButton(card, "기본 외형", representativeDetailMode ? PaperDark : Teal,
                representativeDetailMode ? Ink : Color.white, new Vector2(0.06f, 0.38f), new Vector2(0.48f, 0.45f), ShowRepresentativeBasicParts);
            CreateButton(card, "얼굴 세부", representativeDetailMode ? Teal : PaperDark,
                representativeDetailMode ? Color.white : Ink, new Vector2(0.52f, 0.38f), new Vector2(0.94f, 0.45f), ShowRepresentativeDetailParts);
            if (representativeDetailMode)
            {
                CreateAppearanceRow(card, "얼굴형", "Face", representativeAppearance.Face + 1, 0.305f, 8);
                CreateAppearanceRow(card, "눈", "Eyes", representativeAppearance.Eyes + 1, 0.245f, 10);
                CreateAppearanceRow(card, "눈썹", "Eyebrows", representativeAppearance.Eyebrows + 1, 0.185f, 8);
                CreateAppearanceRow(card, "코", "Nose", representativeAppearance.Nose + 1, 0.125f, 8);
                CreateAppearanceRow(card, "입", "Mouth", representativeAppearance.Mouth + 1, 0.065f, 10);
            }
            else
            {
                CreateAppearanceRow(card, "피부", "Skin", representativeAppearance.Skin + 1, 0.29f, 6);
                CreateAppearanceRow(card, "머리", "Hair", representativeAppearance.Hair + 1, 0.22f, 16);
                CreateAppearanceRow(card, "의상", "Outfit", representativeAppearance.Outfit + 1, 0.15f, 12);
                CreateAppearanceRow(card, "액세서리", "Accessory", representativeAppearance.Accessory + 1, 0.08f, 9);
            }
            CreateButton(screenRoot, "← 회사 이름", Ink, Color.white, new Vector2(0.04f, 0.05f), new Vector2(0.40f, 0.13f), BackToCompanySetup);
            CreateButton(screenRoot, "회사 시작", Teal, Color.white, new Vector2(0.45f, 0.05f), new Vector2(0.96f, 0.13f), CreateCompany);
        }

        private void CreateAppearanceRow(RectTransform parent, string label, string part, int value, float minY, int count)
        {
            CreateText(parent, part + "Label", $"{label}  {value}/{count}", 13, FontStyle.Bold, Ink,
                new Vector2(0.07f, minY), new Vector2(0.55f, minY + 0.055f), TextAnchor.MiddleLeft);
            CreateButton(parent, "◀", PaperDark, Ink, new Vector2(0.59f, minY), new Vector2(0.74f, minY + 0.055f),
                () => ChangeRepresentativePart(part, -1, count));
            CreateButton(parent, "▶", PaperDark, Ink, new Vector2(0.79f, minY), new Vector2(0.94f, minY + 0.055f),
                () => ChangeRepresentativePart(part, 1, count));
        }

        private void ShowRepresentativeBasicParts()
        {
            SaveRepresentativeName();
            representativeDetailMode = false;
            ShowRepresentativeSetup();
        }

        private void ShowRepresentativeDetailParts()
        {
            SaveRepresentativeName();
            representativeDetailMode = true;
            ShowRepresentativeSetup();
        }

        private void SaveRepresentativeName()
        {
            if (representativeNameInput != null && !string.IsNullOrWhiteSpace(representativeNameInput.text))
                representativeName = representativeNameInput.text.Trim();
        }

        private void RandomizeRepresentativeName()
        {
            representativeName = RepresentativeFamilyNames[setupRandom.Next(RepresentativeFamilyNames.Length)] +
                                 RepresentativeGivenNames[setupRandom.Next(RepresentativeGivenNames.Length)];
            ShowRepresentativeSetup();
        }

        private void RandomizeRepresentativeAppearance()
        {
            SaveRepresentativeName();
            representativeAppearance = new AppearanceProfile
            {
                Face = setupRandom.Next(8), Skin = setupRandom.Next(6), Hair = setupRandom.Next(16),
                Eyes = setupRandom.Next(10), Eyebrows = setupRandom.Next(8), Nose = setupRandom.Next(8),
                Mouth = setupRandom.Next(10), Accessory = setupRandom.Next(9), Outfit = setupRandom.Next(12)
            };
            ShowRepresentativeSetup();
        }

        private void ChangeRepresentativePart(string part, int delta, int count)
        {
            SaveRepresentativeName();
            switch (part)
            {
                case "Face": representativeAppearance.Face = Wrap(representativeAppearance.Face + delta, count); break;
                case "Skin": representativeAppearance.Skin = Wrap(representativeAppearance.Skin + delta, count); break;
                case "Hair": representativeAppearance.Hair = Wrap(representativeAppearance.Hair + delta, count); break;
                case "Eyes": representativeAppearance.Eyes = Wrap(representativeAppearance.Eyes + delta, count); break;
                case "Eyebrows": representativeAppearance.Eyebrows = Wrap(representativeAppearance.Eyebrows + delta, count); break;
                case "Nose": representativeAppearance.Nose = Wrap(representativeAppearance.Nose + delta, count); break;
                case "Mouth": representativeAppearance.Mouth = Wrap(representativeAppearance.Mouth + delta, count); break;
                case "Outfit": representativeAppearance.Outfit = Wrap(representativeAppearance.Outfit + delta, count); break;
                case "Accessory": representativeAppearance.Accessory = Wrap(representativeAppearance.Accessory + delta, count); break;
            }
            ShowRepresentativeSetup();
        }

        private static int Wrap(int value, int count) { return (value % count + count) % count; }

        private void BackToCompanySetup()
        {
            SaveRepresentativeName();
            ShowCompanySetup();
        }

        private void CreateCompany()
        {
            SaveRepresentativeName();
            game.CreateCompany(companyName, representativeName, representativeAppearance);
            notice = "첫 프로젝트를 수주할 준비가 됐습니다.";
            ShowOffice();
        }

        private void ShowOffice()
        {
            currentView = View.Office;
            ClearScreen();
            CreateBackground();
            CreateHeader("작은 사무실", notice);

            var room = CreatePanel(screenRoot, "OfficeRoom", PaperDark, new Vector2(0.04f, 0.38f), new Vector2(0.96f, 0.82f));
            AddOutline(room.gameObject, Ink, new Vector2(2f, -2f));
            CreateOfficeTiles(room);
            var employees = game.GetProjectTeam().Take(3).ToArray();
            var positions = new[] { 0.18f, 0.5f, 0.82f };
            for (var index = 0; index < employees.Length; index++)
            {
                var employee = employees[index];
                CreateDesk(room, positions[index], 0.48f);
                CreateSprite(room, employee.Name, PixelArtFactory.Portrait(employee.Department, employee.Appearance),
                    new Vector2(positions[index] - 0.09f, 0.18f), new Vector2(positions[index] + 0.09f, 0.48f));
                CreateText(room, employee.Name + "Label", employee.Name + "\n" + ShortDepartment(employee.Department), 11, FontStyle.Bold, Ink,
                    new Vector2(positions[index] - 0.15f, 0.01f), new Vector2(positions[index] + 0.15f, 0.18f), TextAnchor.MiddleCenter);
            }

            var status = CreatePanel(screenRoot, "CompanyStatus", Panel, new Vector2(0.04f, 0.19f), new Vector2(0.96f, 0.35f));
            AddOutline(status.gameObject, Ink, new Vector2(1f, -1f));
            CreateText(status, "CompanyName", game.Company.Name, 18, FontStyle.Bold, Ink,
                new Vector2(0.04f, 0.58f), new Vector2(0.96f, 0.94f), TextAnchor.MiddleLeft);
            var teamNames = string.Join(" · ", game.GetProjectTeam().Select(employee => employee.Name));
            CreateText(status, "Stats", $"직원 {game.Company.Employees.Count}/{game.Company.RosterCapacity}   현금 {game.Company.Cash}   평판 {game.Company.Reputation}   장비 {game.Company.Inventory.Count}\n프로젝트 팀: {teamNames}",
                13, FontStyle.Normal, Ink, new Vector2(0.04f, 0.08f), new Vector2(0.96f, 0.58f), TextAnchor.MiddleLeft);
            CreateButton(screenRoot, "면접", Blue, Color.white, new Vector2(0.04f, 0.07f), new Vector2(0.25f, 0.16f), OpenInterview);
            CreateButton(screenRoot, "팀 편성", Teal, Color.white, new Vector2(0.28f, 0.07f), new Vector2(0.49f, 0.16f), OpenTeamSelection);
            CreateButton(screenRoot, "장비", Mustard, Ink, new Vector2(0.52f, 0.07f), new Vector2(0.73f, 0.16f), OpenEquipment);
            CreateButton(screenRoot, "프로젝트", Red, Color.white, new Vector2(0.76f, 0.07f), new Vector2(0.96f, 0.16f), StartBattle);
        }

        private void OpenEquipment()
        {
            if (string.IsNullOrEmpty(equipmentEmployeeId) || game.Company.Employees.All(employee => employee.Id != equipmentEmployeeId))
                equipmentEmployeeId = game.Company.Employees[0].Id;
            notice = "직원을 선택하고 장비를 장착하세요.";
            ShowEquipment();
        }

        private void ShowEquipment()
        {
            currentView = View.Equipment;
            ClearScreen();
            CreateBackground();
            var employee = game.Company.Employees.FirstOrDefault(member => member.Id == equipmentEmployeeId) ?? game.Company.Employees[0];
            equipmentEmployeeId = employee.Id;
            CreateHeader("장비 관리", $"{employee.Name} · 실무 {employee.EffectiveWorkPower} · 협업 {employee.EffectiveCollaboration} · {notice}");

            var count = game.Company.Employees.Count;
            var gap = 0.012f;
            var availableWidth = 0.92f - gap * (count - 1);
            var buttonWidth = availableWidth / count;
            for (var index = 0; index < count; index++)
            {
                var member = game.Company.Employees[index];
                var minX = 0.04f + index * (buttonWidth + gap);
                var selected = member.Id == employee.Id;
                var capturedMember = member;
                CreateButton(screenRoot, member.Name, selected ? Teal : PaperDark, selected ? Color.white : Ink,
                    new Vector2(minX, 0.79f), new Vector2(minX + buttonWidth, 0.85f), () => SelectEquipmentEmployee(capturedMember));
            }

            var slots = new[] { EquipmentSlot.WorkTool, EquipmentSlot.SupportTool, EquipmentSlot.PersonalItem };
            for (var index = 0; index < slots.Length; index++)
            {
                var slot = slots[index];
                var item = employee.Equipment.FirstOrDefault(equipment => equipment.Slot == slot);
                var top = 0.76f - index * 0.095f;
                var card = CreatePanel(screenRoot, "Equipped" + slot, item == null ? PaperDark : Panel,
                    new Vector2(0.04f, top - 0.082f), new Vector2(0.96f, top));
                AddOutline(card.gameObject, item == null ? Ink.WithAlpha(0.3f) : RarityColor(item.Rarity), new Vector2(1f, -1f));
                CreateText(card, "Slot", SlotName(slot), 10, FontStyle.Bold, Teal,
                    new Vector2(0.03f, 0.53f), new Vector2(0.30f, 0.93f), TextAnchor.MiddleLeft);
                CreateText(card, "Item", item == null ? "비어 있음" : item.Name, 13, FontStyle.Bold, Ink,
                    new Vector2(0.03f, 0.08f), new Vector2(0.62f, 0.56f), TextAnchor.MiddleLeft);
                if (item == null) continue;
                CreateText(card, "Bonus", $"{RarityName(item.Rarity)} · 실무 +{item.WorkPowerBonus} · 협업 +{item.CollaborationBonus}", 10, FontStyle.Bold, RarityColor(item.Rarity),
                    new Vector2(0.31f, 0.54f), new Vector2(0.74f, 0.93f), TextAnchor.MiddleRight);
                var capturedItem = item;
                CreateButton(card, "해제", Ink, Color.white, new Vector2(0.78f, 0.15f), new Vector2(0.96f, 0.78f), () => Unequip(capturedItem));
            }

            CreateText(screenRoot, "InventoryTitle", $"보관함 · {game.Company.Inventory.Count}", 12, FontStyle.Bold, Teal,
                new Vector2(0.04f, 0.39f), new Vector2(0.96f, 0.46f), TextAnchor.MiddleLeft);
            if (game.Company.Inventory.Count == 0)
            {
                var empty = CreatePanel(screenRoot, "EmptyInventory", PaperDark, new Vector2(0.04f, 0.17f), new Vector2(0.96f, 0.39f));
                AddOutline(empty.gameObject, Ink.WithAlpha(0.3f), new Vector2(1f, -1f));
                CreateText(empty, "Message", "프로젝트를 완료하면\n장비를 획득합니다.", 14, FontStyle.Bold, Ink.WithAlpha(0.65f),
                    new Vector2(0.08f, 0.12f), new Vector2(0.92f, 0.88f), TextAnchor.MiddleCenter);
            }
            else
            {
                for (var index = 0; index < Math.Min(3, game.Company.Inventory.Count); index++)
                {
                    var item = game.Company.Inventory[index];
                    var top = 0.39f - index * 0.075f;
                    var card = CreatePanel(screenRoot, "Inventory" + index, Panel, new Vector2(0.04f, top - 0.065f), new Vector2(0.96f, top));
                    AddOutline(card.gameObject, RarityColor(item.Rarity), new Vector2(1f, -1f));
                    CreateText(card, "Name", item.Name, 12, FontStyle.Bold, Ink,
                        new Vector2(0.03f, 0.40f), new Vector2(0.62f, 0.94f), TextAnchor.MiddleLeft);
                    CreateText(card, "Info", $"{RarityName(item.Rarity)} {SlotName(item.Slot)} · 실무 +{item.WorkPowerBonus} · 협업 +{item.CollaborationBonus}", 9, FontStyle.Bold, RarityColor(item.Rarity),
                        new Vector2(0.03f, 0.05f), new Vector2(0.74f, 0.48f), TextAnchor.MiddleLeft);
                    var capturedItem = item;
                    CreateButton(card, "장착", Teal, Color.white, new Vector2(0.78f, 0.14f), new Vector2(0.96f, 0.82f), () => Equip(capturedItem));
                }
            }

            CreateButton(screenRoot, "← 사무실", Ink, Color.white, new Vector2(0.04f, 0.05f), new Vector2(0.40f, 0.12f), ShowOffice);
        }

        private void SelectEquipmentEmployee(Employee employee)
        {
            equipmentEmployeeId = employee.Id;
            notice = "장착 대상을 변경했습니다.";
            ShowEquipment();
        }

        private void Equip(Equipment equipment)
        {
            game.TryEquip(equipmentEmployeeId, equipment, out notice);
            ShowEquipment();
        }

        private void Unequip(Equipment equipment)
        {
            game.TryUnequip(equipmentEmployeeId, equipment, out notice);
            ShowEquipment();
        }

        private void OpenInterview()
        {
            candidates = game.GenerateInterviewCandidates();
            notice = "능력과 연봉 조건을 비교해 동료를 채용하세요.";
            ShowInterview();
        }

        private void ShowInterview()
        {
            currentView = View.Interview;
            ClearScreen();
            CreateBackground();
            CreateHeader("면접실", notice);
            CreateButton(screenRoot, "← 사무실", Ink, Color.white, new Vector2(0.04f, 0.05f), new Vector2(0.36f, 0.12f), ShowOffice);

            for (var index = 0; index < candidates.Count; index++)
            {
                var candidate = candidates[index];
                var top = 0.82f - index * 0.225f;
                var card = CreatePanel(screenRoot, "Candidate" + index, Panel, new Vector2(0.04f, top - 0.20f), new Vector2(0.96f, top));
                AddOutline(card.gameObject, RankColor(candidate.Employee.Rank), new Vector2(2f, -2f));
                CreateSprite(card, "Portrait", PixelArtFactory.Portrait(candidate.Employee.Department, candidate.Employee.Appearance),
                    new Vector2(0.03f, 0.14f), new Vector2(0.23f, 0.86f));
                CreateText(card, "Name", candidate.Employee.Name + "  " + RankName(candidate.Employee.Rank), 16, FontStyle.Bold, Ink,
                    new Vector2(0.26f, 0.66f), new Vector2(0.74f, 0.94f), TextAnchor.MiddleLeft);
                CreateText(card, "Department", ShortDepartment(candidate.Employee.Department) + " · " + candidate.Employee.Trait, 12, FontStyle.Normal, Teal,
                    new Vector2(0.26f, 0.48f), new Vector2(0.96f, 0.68f), TextAnchor.MiddleLeft);
                CreateText(card, "Stats", $"실무 {candidate.Employee.WorkPower}  협업 {candidate.Employee.Collaboration}  속도 {candidate.Employee.Speed}\n계약금 {candidate.SigningCost} · 월급 {candidate.Employee.MonthlySalary}",
                    12, FontStyle.Normal, Ink, new Vector2(0.26f, 0.08f), new Vector2(0.74f, 0.47f), TextAnchor.MiddleLeft);
                var capturedCandidate = candidate;
                CreateButton(card, "채용", RankColor(candidate.Employee.Rank), Color.white,
                    new Vector2(0.76f, 0.10f), new Vector2(0.96f, 0.43f), () => Hire(capturedCandidate));
            }
        }

        private void Hire(Candidate candidate)
        {
            game.TryHire(candidate, out notice);
            ShowInterview();
        }

        private void OpenTeamSelection()
        {
            teamDraft = game.GetProjectTeam().Select(employee => employee.Id).ToList();
            notice = "참가할 직원 3명을 선택하세요. 선택한 순서대로 배치됩니다.";
            ShowTeamSelection();
        }

        private void ShowTeamSelection()
        {
            currentView = View.TeamSelection;
            ClearScreen();
            CreateBackground();
            CreateHeader("프로젝트 팀 편성", $"선택 {teamDraft.Count}/{game.Company.ProjectTeamSize} · {notice}");

            for (var index = 0; index < game.Company.Employees.Count; index++)
            {
                var employee = game.Company.Employees[index];
                var selected = teamDraft.Contains(employee.Id);
                var top = 0.82f - index * 0.135f;
                var card = CreatePanel(screenRoot, "TeamMember" + index,
                    selected ? DepartmentColor(employee.Department).WithAlpha(0.16f) : Panel,
                    new Vector2(0.04f, top - 0.115f), new Vector2(0.96f, top));
                AddOutline(card.gameObject, selected ? DepartmentColor(employee.Department) : Ink.WithAlpha(0.35f), new Vector2(2f, -2f));
                CreateSprite(card, "Portrait", PixelArtFactory.Portrait(employee.Department, employee.Appearance),
                    new Vector2(0.025f, 0.10f), new Vector2(0.18f, 0.90f));
                var order = selected ? teamDraft.IndexOf(employee.Id) + 1 : 0;
                CreateText(card, "Name", (selected ? order + ". " : string.Empty) + employee.Name + " · " + ShortDepartment(employee.Department),
                    15, FontStyle.Bold, Ink, new Vector2(0.21f, 0.52f), new Vector2(0.73f, 0.91f), TextAnchor.MiddleLeft);
                CreateText(card, "Stats", $"실무 {employee.EffectiveWorkPower}  협업 {employee.EffectiveCollaboration}  속도 {employee.Speed}",
                    11, FontStyle.Normal, Ink, new Vector2(0.21f, 0.10f), new Vector2(0.74f, 0.53f), TextAnchor.MiddleLeft);
                var capturedEmployee = employee;
                CreateButton(card, selected ? "제외" : "선택", selected ? Red : Teal, Color.white,
                    new Vector2(0.77f, 0.18f), new Vector2(0.96f, 0.82f), () => ToggleTeamMember(capturedEmployee));
            }

            CreateButton(screenRoot, "취소", Ink, Color.white, new Vector2(0.04f, 0.05f), new Vector2(0.36f, 0.12f), ShowOffice);
            CreateButton(screenRoot, "편성 저장", Mustard, Ink, new Vector2(0.42f, 0.05f), new Vector2(0.96f, 0.12f), SaveTeamSelection);
        }

        private void ToggleTeamMember(Employee employee)
        {
            if (teamDraft.Remove(employee.Id))
            {
                notice = employee.Name + " 님을 팀에서 제외했습니다.";
            }
            else if (teamDraft.Count < game.Company.ProjectTeamSize)
            {
                teamDraft.Add(employee.Id);
                notice = employee.Name + " 님을 팀에 추가했습니다.";
            }
            else
            {
                notice = $"프로젝트에는 {game.Company.ProjectTeamSize}명만 참가할 수 있습니다.";
            }

            ShowTeamSelection();
        }

        private void SaveTeamSelection()
        {
            if (game.TrySetProjectTeam(teamDraft, out notice))
            {
                ShowOffice();
                return;
            }

            ShowTeamSelection();
        }

        private void StartBattle()
        {
            game.StartPrototypeBattle();
            resultClaimed = false;
            battleTimer = 0f;
            attackAnimation = 0f;
            notice = "업무 연계로 마감시계의 핵심을 공략합니다.";
            ShowBattle();
        }

        private void ShowBattle()
        {
            currentView = View.Battle;
            ClearScreen();
            CreateBackground();

            var header = CreatePanel(screenRoot, "BattleHeader", Ink, new Vector2(0f, 0.91f), new Vector2(1f, 1f));
            CreateText(header, "Company", game.Company.Name, 14, FontStyle.Bold, Color.white,
                new Vector2(0.04f, 0.10f), new Vector2(0.72f, 0.90f), TextAnchor.MiddleLeft);
            CreateText(header, "Auto", "● 자동", 12, FontStyle.Bold, Mustard,
                new Vector2(0.72f, 0.10f), new Vector2(0.96f, 0.90f), TextAnchor.MiddleRight);
            battleTitle = CreateText(screenRoot, "ProjectTitle", string.Empty, 18, FontStyle.Bold, Ink,
                new Vector2(0.04f, 0.855f), new Vector2(0.74f, 0.91f), TextAnchor.MiddleLeft);
            battleDeadline = CreateText(screenRoot, "Deadline", string.Empty, 12, FontStyle.Bold, Red,
                new Vector2(0.72f, 0.855f), new Vector2(0.96f, 0.91f), TextAnchor.MiddleRight);

            var bar = CreatePanel(screenRoot, "WorkBar", PaperDark, new Vector2(0.04f, 0.815f), new Vector2(0.96f, 0.85f));
            battleWorkFill = CreateImage(bar, "Fill", Red, Vector2.zero, Vector2.one);
            battleWorkload = CreateText(bar, "WorkText", string.Empty, 11, FontStyle.Bold, Color.white,
                Vector2.zero, Vector2.one, TextAnchor.MiddleCenter);

            var arena = CreatePanel(screenRoot, "Arena", Hex("D9D3C3"), new Vector2(0.025f, 0.30f), new Vector2(0.975f, 0.805f));
            AddOutline(arena.gameObject, Ink, new Vector2(2f, -2f));
            CreateOfficeTiles(arena);
            CreateSprite(arena, "ProjectBoss", PixelArtFactory.ProjectBoss(), new Vector2(0.34f, 0.66f), new Vector2(0.66f, 0.99f));
            CreateText(arena, "BossName", "수정요청 더미", 11, FontStyle.Bold, Red,
                new Vector2(0.30f, 0.59f), new Vector2(0.70f, 0.68f), TextAnchor.MiddleCenter);
            battleStatus = CreateText(arena, "BattleStatus", "STATUS · 안정", 11, FontStyle.Bold, Teal,
                new Vector2(0.025f, 0.88f), new Vector2(0.33f, 0.97f), TextAnchor.MiddleLeft);
            var team = game.GetProjectTeam().Take(3).ToArray();
            var battlePositions = new[]
            {
                new Vector4(0.08f, 0.12f, 0.34f, 0.48f),
                new Vector4(0.38f, 0.05f, 0.62f, 0.41f),
                new Vector4(0.68f, 0.12f, 0.94f, 0.48f)
            };
            for (var index = 0; index < team.Length; index++)
            {
                var position = battlePositions[index];
                CreateBattleEmployee(arena, team[index], position.x, position.y, position.z, position.w);
            }

            var shield = CreateImage(arena, "ScheduleShield", Teal.WithAlpha(0.58f), new Vector2(0.14f, 0.43f), new Vector2(0.43f, 0.60f));
            AddOutline(shield.gameObject, Color.white, new Vector2(1f, -1f));
            CreateText(shield.rectTransform, "ShieldText", "일정\n방어", 11, FontStyle.Bold, Color.white, Vector2.zero, Vector2.one, TextAnchor.MiddleCenter);
            CreateAttackLane(arena, "SalesLane", Mustard, new Vector2(0.69f, 0.42f), new Vector2(0.58f, 0.72f), 15f);
            salesEffect = CreateSprite(arena, "SalesEffect", PixelArtFactory.AttackBlock(Mustard),
                new Vector2(0.66f, 0.41f), new Vector2(0.73f, 0.48f)).rectTransform;
            CreateText(arena, "SalesArrow", "▲", 18, FontStyle.Bold, Mustard,
                new Vector2(0.54f, 0.68f), new Vector2(0.64f, 0.78f), TextAnchor.MiddleCenter);
            CreateAttackLane(arena, "DeveloperLane", Teal, new Vector2(0.485f, 0.38f), new Vector2(0.485f, 0.68f), 0f);
            developerEffect = CreateSprite(arena, "DeveloperEffect", PixelArtFactory.AttackBlock(Teal),
                new Vector2(0.455f, 0.39f), new Vector2(0.515f, 0.46f)).rectTransform;
            CreateText(arena, "DeveloperArrow", "▲", 18, FontStyle.Bold, Teal,
                new Vector2(0.44f, 0.65f), new Vector2(0.54f, 0.75f), TextAnchor.MiddleCenter);

            battleLog = CreateText(screenRoot, "BattleLog", string.Empty, 12, FontStyle.Bold, Ink,
                new Vector2(0.04f, 0.255f), new Vector2(0.96f, 0.30f), TextAnchor.MiddleCenter);
            for (var index = 0; index < team.Length; index++)
            {
                var minX = 0.025f + index * 0.325f;
                CreateBattleCard(screenRoot, team[index], minX, minX + 0.30f);
            }

            battleResult = CreatePanel(screenRoot, "BattleResult", Ink.WithAlpha(0.97f), new Vector2(0.05f, 0.30f), new Vector2(0.95f, 0.60f)).gameObject;
            battleResultText = CreateText(battleResult.transform, "ResultText", string.Empty, 17, FontStyle.Bold, Color.white,
                new Vector2(0.07f, 0.38f), new Vector2(0.93f, 0.90f), TextAnchor.MiddleCenter);
            CreateButton(battleResult.transform, "사무실로 복귀", Mustard, Ink,
                new Vector2(0.12f, 0.10f), new Vector2(0.88f, 0.34f), ShowOffice);
            battleResult.SetActive(false);
            RefreshBattle();
        }

        private void RefreshBattle()
        {
            var battle = game.CurrentBattle;
            if (battle == null || battleTitle == null) return;
            battleTitle.text = "PROJECT 01 · 앱 출시";
            battleDeadline.text = $"DAY {battle.Turn}/{battle.Project.DeadlineTurns}";
            battleWorkload.text = $"남은 업무 {battle.RemainingWorkload}/{battle.Project.MaxWorkload}";
            var ratio = Mathf.Clamp01(battle.RemainingWorkload / (float)battle.Project.MaxWorkload);
            battleWorkFill.rectTransform.anchorMax = new Vector2(ratio, 1f);
            battleLog.text = battle.Logs.Count == 0 ? notice : battle.Logs[battle.Logs.Count - 1];
            battleStatus.text = string.IsNullOrEmpty(battle.ActiveStatusName)
                ? "STATUS · 안정"
                : $"STATUS · {battle.ActiveStatusName} {battle.ActiveStatusTurns}일";
            battleStatus.color = battle.ActiveStatusName == "합의 완료" ? Teal :
                string.IsNullOrEmpty(battle.ActiveStatusName) ? Teal : Red;
            if (!battle.IsComplete) return;
            if (!resultClaimed)
            {
                game.ClaimBattleResult(out notice);
                resultClaimed = true;
            }
            battleResultText.text = (battle.IsSuccess ? "PROJECT COMPLETE\n" : "DEADLINE OVER\n") + notice;
            battleResult.SetActive(true);
        }

        private void AnimateAttackEffects()
        {
            if (currentView != View.Battle || salesEffect == null || developerEffect == null) return;
            attackAnimation = Mathf.Repeat(attackAnimation + Time.deltaTime * 1.5f, 1f);
            var eased = attackAnimation * attackAnimation * (3f - 2f * attackAnimation);
            SetAnchoredCenter(salesEffect, Vector2.Lerp(new Vector2(0.70f, 0.43f), new Vector2(0.58f, 0.70f), eased));
            SetAnchoredCenter(developerEffect, Vector2.Lerp(new Vector2(0.485f, 0.40f), new Vector2(0.485f, 0.69f), eased));
        }

        private void CreateBattleEmployee(RectTransform parent, Employee employee, float minX, float minY, float maxX, float maxY)
        {
            CreateSprite(parent, employee.Name, PixelArtFactory.PortraitBack(employee.Department, employee.Appearance),
                new Vector2(minX, minY), new Vector2(maxX, maxY));
        }

        private void CreateBattleCard(RectTransform parent, Employee employee, float minX, float maxX)
        {
            var card = CreatePanel(parent, employee.Name + "Card", Panel, new Vector2(minX, 0.055f), new Vector2(maxX, 0.235f));
            AddOutline(card.gameObject, DepartmentColor(employee.Department), new Vector2(2f, -2f));
            CreateText(card, "Role", ShortDepartment(employee.Department), 13, FontStyle.Bold, DepartmentColor(employee.Department),
                new Vector2(0.05f, 0.68f), new Vector2(0.95f, 0.95f), TextAnchor.MiddleCenter);
            CreateText(card, "Name", employee.Name, 12, FontStyle.Bold, Ink,
                new Vector2(0.05f, 0.45f), new Vector2(0.95f, 0.69f), TextAnchor.MiddleCenter);
            CreateText(card, "Skill", SkillName(employee.Department), 11, FontStyle.Normal, Ink,
                new Vector2(0.05f, 0.06f), new Vector2(0.95f, 0.44f), TextAnchor.MiddleCenter);
        }

        private void CreateAttackLane(RectTransform parent, string name, Color color, Vector2 start, Vector2 end, float rotation)
        {
            var center = (start + end) * 0.5f;
            var length = Vector2.Distance(start, end);
            var lane = CreateImage(parent, name, color.WithAlpha(0.42f), center - new Vector2(0.008f, length * 0.5f), center + new Vector2(0.008f, length * 0.5f));
            lane.rectTransform.localRotation = Quaternion.Euler(0f, 0f, rotation);
        }

        private void CreateOfficeTiles(RectTransform parent)
        {
            for (var index = 1; index < 6; index++)
                CreateImage(parent, "FloorLine" + index, Ink.WithAlpha(0.08f), new Vector2(0f, index / 6f), new Vector2(1f, index / 6f + 0.004f));
        }

        private void CreateOpeningOffice(RectTransform room)
        {
            CreateImage(room, "OfficeFloor", Hex("C8B99D"), new Vector2(0f, 0f), new Vector2(1f, 0.40f));
            for (var index = 1; index < 4; index++)
                CreateImage(room, "FloorLine" + index, Ink.WithAlpha(0.08f), new Vector2(0f, index * 0.10f), new Vector2(1f, index * 0.10f + 0.006f));

            var window = CreatePanel(room, "OfficeWindow", Hex("7BB7C5"), new Vector2(0.06f, 0.55f), new Vector2(0.36f, 0.92f));
            AddOutline(window.gameObject, Ink, new Vector2(2f, -2f));
            CreateImage(window, "WindowVertical", Ink, new Vector2(0.49f, 0f), new Vector2(0.52f, 1f));
            CreateImage(window, "WindowHorizontal", Ink, new Vector2(0f, 0.49f), new Vector2(1f, 0.52f));

            var clock = CreatePanel(room, "OfficeClock", Panel, new Vector2(0.45f, 0.73f), new Vector2(0.54f, 0.89f));
            AddOutline(clock.gameObject, Ink, new Vector2(1f, -1f));
            CreateText(clock, "Hands", "◷", 17, FontStyle.Bold, Ink, Vector2.zero, Vector2.one, TextAnchor.MiddleCenter);

            var shelf = CreatePanel(room, "OfficeShelf", Hex("B47B4F"), new Vector2(0.68f, 0.58f), new Vector2(0.94f, 0.88f));
            AddOutline(shelf.gameObject, Ink, new Vector2(2f, -2f));
            CreateImage(shelf, "BookOne", Mustard, new Vector2(0.10f, 0.10f), new Vector2(0.27f, 0.68f));
            CreateImage(shelf, "BookTwo", Teal, new Vector2(0.34f, 0.10f), new Vector2(0.51f, 0.88f));
            CreateImage(shelf, "Box", Red, new Vector2(0.60f, 0.10f), new Vector2(0.90f, 0.48f));

            foreach (var position in new[] { 0.20f, 0.50f, 0.80f }) CreateOpeningWorkstation(room, position);
        }

        private void CreateOpeningWorkstation(RectTransform parent, float centerX)
        {
            var chair = CreatePanel(parent, "EmptyChair", Blue, new Vector2(centerX - 0.055f, 0.03f), new Vector2(centerX + 0.055f, 0.24f));
            AddOutline(chair.gameObject, Ink, new Vector2(1f, -1f));
            CreateImage(parent, "DeskTop", Hex("A36E45"), new Vector2(centerX - 0.13f, 0.19f), new Vector2(centerX + 0.13f, 0.31f));
            CreateImage(parent, "DeskLeftLeg", Ink, new Vector2(centerX - 0.115f, 0.04f), new Vector2(centerX - 0.095f, 0.20f));
            CreateImage(parent, "DeskRightLeg", Ink, new Vector2(centerX + 0.095f, 0.04f), new Vector2(centerX + 0.115f, 0.20f));
            CreateImage(parent, "Monitor", Ink, new Vector2(centerX - 0.07f, 0.29f), new Vector2(centerX + 0.07f, 0.49f));
            CreateImage(parent, "Screen", Teal, new Vector2(centerX - 0.055f, 0.32f), new Vector2(centerX + 0.055f, 0.46f));
            CreateImage(parent, "MonitorStand", Ink, new Vector2(centerX - 0.012f, 0.24f), new Vector2(centerX + 0.012f, 0.31f));
        }

        private void CreateStoryPaper(RectTransform parent, string name, Vector2 center, float rotation)
        {
            var paper = CreatePanel(parent, name, Panel, center - new Vector2(0.03f, 0.035f), center + new Vector2(0.03f, 0.035f));
            AddOutline(paper.gameObject, Ink, new Vector2(1f, -1f));
            paper.localRotation = Quaternion.Euler(0f, 0f, rotation);
        }

        private void CreateDesk(RectTransform parent, float centerX, float centerY)
        {
            CreateImage(parent, "Desk", Hex("A36E45"), new Vector2(centerX - 0.13f, centerY), new Vector2(centerX + 0.13f, centerY + 0.18f));
            CreateImage(parent, "Monitor", Ink, new Vector2(centerX - 0.07f, centerY + 0.08f), new Vector2(centerX + 0.07f, centerY + 0.22f));
            CreateImage(parent, "Screen", Teal, new Vector2(centerX - 0.055f, centerY + 0.10f), new Vector2(centerX + 0.055f, centerY + 0.20f));
        }

        private void CreateHeader(string title, string subtitle)
        {
            var header = CreatePanel(screenRoot, "Header", Ink, new Vector2(0f, 0.86f), new Vector2(1f, 1f));
            CreateText(header, "Title", title, 24, FontStyle.Bold, Color.white,
                new Vector2(0.04f, 0.44f), new Vector2(0.96f, 0.94f), TextAnchor.MiddleLeft);
            CreateText(header, "Subtitle", subtitle, 12, FontStyle.Normal, Paper,
                new Vector2(0.04f, 0.05f), new Vector2(0.96f, 0.46f), TextAnchor.MiddleLeft);
        }

        private void CreateBackground()
        {
            CreateImage(screenRoot, "PaperBackground", Paper, Vector2.zero, Vector2.one);
            for (var index = 0; index < 12; index++)
                CreateImage(screenRoot, "PaperLine" + index, Ink.WithAlpha(0.025f), new Vector2(0f, index / 12f), new Vector2(1f, index / 12f + 0.002f));
        }

        private void ClearScreen()
        {
            for (var index = screenRoot.childCount - 1; index >= 0; index--) Destroy(screenRoot.GetChild(index).gameObject);
            battleTitle = null;
            battleDeadline = null;
            battleWorkload = null;
            battleLog = null;
            battleStatus = null;
            battleWorkFill = null;
            battleResult = null;
            battleResultText = null;
            salesEffect = null;
            developerEffect = null;
        }

        private InputField CreateInputField(Transform parent, string value, Vector2 min, Vector2 max)
        {
            var root = CreatePanel(parent, "CompanyNameInput", Color.white, min, max);
            AddOutline(root.gameObject, Ink, new Vector2(1f, -1f));
            var text = CreateText(root, "Text", value, 17, FontStyle.Bold, Ink,
                new Vector2(0.04f, 0f), new Vector2(0.96f, 1f), TextAnchor.MiddleLeft);
            var input = root.gameObject.AddComponent<InputField>();
            input.textComponent = text;
            input.text = value;
            input.characterLimit = 24;
            input.lineType = InputField.LineType.SingleLine;
            return input;
        }

        private Button CreateButton(Transform parent, string label, Color background, Color foreground, Vector2 min, Vector2 max, Action onClick)
        {
            var image = CreateImage(parent, label + "Button", background, min, max);
            AddOutline(image.gameObject, Ink.WithAlpha(0.75f), new Vector2(2f, -2f));
            var button = image.gameObject.AddComponent<Button>();
            button.targetGraphic = image;
            button.onClick.AddListener(() => onClick());
            CreateText(image.rectTransform, "Label", label, 14, FontStyle.Bold, foreground, Vector2.zero, Vector2.one, TextAnchor.MiddleCenter);
            return button;
        }

        private Text CreateText(Transform parent, string name, string value, int size, FontStyle style, Color color, Vector2 min, Vector2 max, TextAnchor alignment)
        {
            var rect = CreateRect(parent, name);
            SetAnchors(rect, min, max);
            var text = rect.gameObject.AddComponent<Text>();
            text.font = font;
            text.text = value;
            text.fontSize = size;
            text.fontStyle = style;
            text.color = color;
            text.alignment = alignment;
            text.resizeTextForBestFit = true;
            text.resizeTextMinSize = Mathf.Max(9, size - 4);
            text.resizeTextMaxSize = size;
            text.horizontalOverflow = HorizontalWrapMode.Wrap;
            text.verticalOverflow = VerticalWrapMode.Truncate;
            return text;
        }

        private static Image CreateImage(Transform parent, string name, Color color, Vector2 min, Vector2 max)
        {
            var rect = CreateRect(parent, name);
            SetAnchors(rect, min, max);
            var image = rect.gameObject.AddComponent<Image>();
            image.color = color;
            return image;
        }

        private static RectTransform CreatePanel(Transform parent, string name, Color color, Vector2 min, Vector2 max)
        {
            return CreateImage(parent, name, color, min, max).rectTransform;
        }

        private static Image CreateSprite(Transform parent, string name, Sprite sprite, Vector2 min, Vector2 max)
        {
            var image = CreateImage(parent, name, Color.white, min, max);
            image.sprite = sprite;
            image.preserveAspect = true;
            return image;
        }

        private static RectTransform CreateRect(Transform parent, string name)
        {
            var gameObject = new GameObject(name, typeof(RectTransform));
            var rect = gameObject.GetComponent<RectTransform>();
            rect.SetParent(parent, false);
            return rect;
        }

        private static void SetAnchors(RectTransform rect, Vector2 min, Vector2 max)
        {
            rect.anchorMin = min;
            rect.anchorMax = max;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }

        private static void Stretch(RectTransform rect) { SetAnchors(rect, Vector2.zero, Vector2.one); }

        private static void SetAnchoredCenter(RectTransform rect, Vector2 center)
        {
            var size = rect.anchorMax - rect.anchorMin;
            SetAnchors(rect, center - size * 0.5f, center + size * 0.5f);
        }

        private static void AddOutline(GameObject target, Color color, Vector2 distance)
        {
            var outline = target.AddComponent<Outline>();
            outline.effectColor = color;
            outline.effectDistance = distance;
            outline.useGraphicAlpha = true;
        }

        private static void EnsureEventSystem()
        {
            if (FindFirstObjectByType<EventSystem>() != null) return;
            var eventSystem = new GameObject("EventSystem", typeof(EventSystem), typeof(StandaloneInputModule));
            DontDestroyOnLoad(eventSystem);
        }

        private static string ShortDepartment(Department department)
        {
            switch (department)
            {
                case Department.Sales: return "영업";
                case Department.ProjectManagement: return "일정";
                case Department.Development: return "개발";
                case Department.Finance: return "재무";
                case Department.Design: return "디자인";
                case Department.Marketing: return "마케팅";
                case Department.HumanResources: return "인사";
                case Department.Legal: return "법무";
                case Department.QualityAssurance: return "품질";
                case Department.InformationTechnology: return "운영";
                default: return department.ToString();
            }
        }

        private static string SkillName(Department department)
        {
            switch (department)
            {
                case Department.ProjectManagement: return "일정 방어";
                case Department.Sales: return "요구 정리";
                case Department.Development: return "집중 개발";
                default: return "업무 처리";
            }
        }

        private static string RankName(EmployeeRank rank)
        {
            switch (rank)
            {
                case EmployeeRank.Rookie: return "신입";
                case EmployeeRank.Experienced: return "경력자";
                case EmployeeRank.Specialist: return "전문가";
                case EmployeeRank.Ace: return "에이스";
                case EmployeeRank.Legend: return "업계 전설";
                default: return rank.ToString();
            }
        }

        private static Color DepartmentColor(Department department)
        {
            switch (department)
            {
                case Department.ProjectManagement: return Blue;
                case Department.Sales: return Mustard;
                case Department.Development: return Teal;
                case Department.Finance: return Hex("6D7C8C");
                default: return Hex("9B6D9D");
            }
        }

        private static Color RankColor(EmployeeRank rank)
        {
            switch (rank)
            {
                case EmployeeRank.Experienced: return Hex("4E9F67");
                case EmployeeRank.Specialist: return Blue;
                case EmployeeRank.Ace: return Hex("A35DB3");
                case EmployeeRank.Legend: return Mustard;
                default: return Hex("7E8790");
            }
        }

        private static string SlotName(EquipmentSlot slot)
        {
            switch (slot)
            {
                case EquipmentSlot.WorkTool: return "업무 도구";
                case EquipmentSlot.SupportTool: return "보조 도구";
                case EquipmentSlot.PersonalItem: return "개인 소지품";
                default: return slot.ToString();
            }
        }

        private static string RarityName(EquipmentRarity rarity)
        {
            switch (rarity)
            {
                case EquipmentRarity.Common: return "일반";
                case EquipmentRarity.Uncommon: return "고급";
                case EquipmentRarity.Rare: return "희귀";
                case EquipmentRarity.Epic: return "영웅";
                case EquipmentRarity.Legendary: return "전설";
                default: return rarity.ToString();
            }
        }

        private static Color RarityColor(EquipmentRarity rarity)
        {
            switch (rarity)
            {
                case EquipmentRarity.Uncommon: return Hex("4E9F67");
                case EquipmentRarity.Rare: return Blue;
                case EquipmentRarity.Epic: return Hex("A35DB3");
                case EquipmentRarity.Legendary: return Mustard;
                default: return Hex("7E8790");
            }
        }

        private static Color Hex(string hex)
        {
            ColorUtility.TryParseHtmlString("#" + hex, out var color);
            return color;
        }
    }

    internal static class ColorExtensions
    {
        public static Color WithAlpha(this Color color, float alpha)
        {
            color.a = alpha;
            return color;
        }
    }
}
