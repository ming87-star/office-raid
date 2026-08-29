using System.Collections.Generic;
using OfficeRaid.Core;
using UnityEngine;

namespace OfficeRaid.Runtime
{
    internal static class PixelArtFactory
    {
        private static readonly Dictionary<Department, Sprite> Employees = new Dictionary<Department, Sprite>();
        private static readonly Dictionary<Department, Sprite> EmployeeBacks = new Dictionary<Department, Sprite>();
        private static readonly Dictionary<string, Sprite> Portraits = new Dictionary<string, Sprite>();
        private static readonly Dictionary<string, Sprite> PortraitBacks = new Dictionary<string, Sprite>();
        private static readonly Dictionary<string, Sprite> AttackBlocks = new Dictionary<string, Sprite>();
        private static Sprite projectBoss;

        public static Sprite Employee(Department department)
        {
            if (Employees.TryGetValue(department, out var cached)) return cached;
            var pixels = Canvas(24, 32);
            var outline = ToColor("17364A");
            var skin = ToColor("D99D78");
            var hair = ToColor("443A38");
            var shirt = DepartmentColor(department);
            Fill(pixels, 24, 6, 1, 5, 7, outline);
            Fill(pixels, 24, 13, 1, 5, 7, outline);
            Fill(pixels, 24, 5, 8, 14, 11, outline);
            Fill(pixels, 24, 6, 9, 12, 9, shirt);
            Fill(pixels, 24, 2, 10, 4, 8, skin);
            Fill(pixels, 24, 18, 10, 4, 8, skin);
            Fill(pixels, 24, 9, 18, 6, 2, skin);
            Fill(pixels, 24, 4, 19, 16, 11, outline);
            Fill(pixels, 24, 5, 20, 14, 9, skin);
            Fill(pixels, 24, 5, 27, 14, 4, hair);
            Fill(pixels, 24, 6, 26, 8, 2, hair);
            Fill(pixels, 24, 7, 23, 2, 1, outline);
            Fill(pixels, 24, 15, 23, 2, 1, outline);
            Fill(pixels, 24, 10, 21, 4, 1, outline);
            return Employees[department] = Build("Employee_" + department, 24, 32, pixels);
        }

        public static Sprite EmployeeBack(Department department)
        {
            if (EmployeeBacks.TryGetValue(department, out var cached)) return cached;
            var pixels = Canvas(24, 32);
            var outline = ToColor("17364A");
            var skin = ToColor("D99D78");
            var hair = ToColor("443A38");
            var shirt = DepartmentColor(department);
            Fill(pixels, 24, 6, 1, 5, 7, outline);
            Fill(pixels, 24, 13, 1, 5, 7, outline);
            Fill(pixels, 24, 5, 8, 14, 11, outline);
            Fill(pixels, 24, 6, 9, 12, 9, shirt);
            Fill(pixels, 24, 10, 10, 4, 8, DepartmentColor(department));
            Fill(pixels, 24, 2, 10, 4, 8, skin);
            Fill(pixels, 24, 18, 10, 4, 8, skin);
            Fill(pixels, 24, 9, 18, 6, 2, skin);
            Fill(pixels, 24, 4, 19, 16, 11, outline);
            Fill(pixels, 24, 5, 20, 14, 9, hair);
            Fill(pixels, 24, 5, 27, 14, 4, hair);
            return EmployeeBacks[department] = Build("EmployeeBack_" + department, 24, 32, pixels);
        }

        public static Sprite Portrait(Department department, AppearanceProfile appearance)
        {
            var key = department + "_" + appearance.Face + "_" + appearance.Skin + "_" + appearance.Hair + "_" +
                      appearance.Eyes + "_" + appearance.Eyebrows + "_" + appearance.Nose + "_" +
                      appearance.Mouth + "_" + appearance.Accessory + "_" + appearance.Outfit;
            if (Portraits.TryGetValue(key, out var cached)) return cached;
            var pixels = Canvas(24, 24);
            var outline = ToColor("17364A");
            var skinColors = new[]
            {
                ToColor("F7D7BD"), ToColor("EDBE98"), ToColor("D99D78"),
                ToColor("BD7F5C"), ToColor("956044"), ToColor("704536")
            };
            var hairColors = new[]
            {
                ToColor("29272C"), ToColor("573B32"), ToColor("8B593A"),
                ToColor("C2853D"), ToColor("6E3047"), ToColor("243E52")
            };
            var skin = skinColors[appearance.Skin % skinColors.Length];
            var hair = hairColors[(appearance.Hair / 3) % hairColors.Length];
            DrawOutfit(pixels, department, appearance.Outfit, outline, skin);
            DrawFace(pixels, appearance.Face, outline, skin);
            DrawHair(pixels, appearance.Hair, hair, outline);
            DrawEyebrows(pixels, appearance.Eyebrows, hair, outline);
            DrawEyes(pixels, appearance.Eyes, outline);
            DrawNose(pixels, appearance.Nose, SkinShade(skin));
            DrawMouth(pixels, appearance.Mouth, outline);
            DrawAccessory(pixels, appearance.Accessory, hair, outline, skin);
            return Portraits[key] = Build("Portrait_" + key, 24, 24, pixels);
        }

        public static Sprite PortraitBack(Department department, AppearanceProfile appearance)
        {
            var key = department + "_" + appearance.Face + "_" + appearance.Skin + "_" + appearance.Hair + "_" +
                      appearance.Eyes + "_" + appearance.Eyebrows + "_" + appearance.Nose + "_" +
                      appearance.Mouth + "_" + appearance.Accessory + "_" + appearance.Outfit;
            if (PortraitBacks.TryGetValue(key, out var cached)) return cached;

            var pixels = Canvas(24, 24);
            var outline = ToColor("17364A");
            var skin = SkinColor(appearance.Skin);
            var hair = HairColor(appearance.Hair);
            DrawOutfit(pixels, department, appearance.Outfit, outline, skin);
            Fill(pixels, 24, 4, 7, 16, 13, outline);
            Fill(pixels, 24, 5, 8, 14, 12, hair);
            Fill(pixels, 24, 4, 17, 16, 4, outline);
            Fill(pixels, 24, 5, 18, 14, 4, hair);

            var hairStyle = appearance.Hair % 8;
            if (hairStyle == 2)
            {
                Fill(pixels, 24, 3, 8, 3, 10, hair);
                Fill(pixels, 24, 18, 8, 3, 10, hair);
            }
            else if (hairStyle == 3)
            {
                Fill(pixels, 24, 2, 6, 4, 12, hair);
                Fill(pixels, 24, 18, 6, 4, 12, hair);
            }

            if (appearance.Accessory == 4) Fill(pixels, 24, 16, 20, 3, 1, ToColor("C84B3C"));
            if (appearance.Accessory == 5)
            {
                Fill(pixels, 24, 2, 11, 2, 7, outline);
                Fill(pixels, 24, 20, 11, 2, 7, outline);
            }
            if (appearance.Accessory == 8)
            {
                Fill(pixels, 24, 4, 20, 16, 2, outline);
                Fill(pixels, 24, 5, 21, 14, 2, ToColor("D6A12C"));
            }

            return PortraitBacks[key] = Build("PortraitBack_" + key, 24, 24, pixels);
        }

        private static Color32 SkinColor(int variant)
        {
            var colors = new[]
            {
                ToColor("F7D7BD"), ToColor("EDBE98"), ToColor("D99D78"),
                ToColor("BD7F5C"), ToColor("956044"), ToColor("704536")
            };
            return colors[variant % colors.Length];
        }

        private static Color32 HairColor(int variant)
        {
            var colors = new[]
            {
                ToColor("29272C"), ToColor("573B32"), ToColor("8B593A"),
                ToColor("C2853D"), ToColor("6E3047"), ToColor("243E52")
            };
            return colors[(variant / 3) % colors.Length];
        }

        private static void DrawFace(Color32[] pixels, int variant, Color32 outline, Color32 skin)
        {
            var widths = new[] { 16, 16, 14, 14, 16, 14, 16, 14 };
            var heights = new[] { 14, 13, 14, 13, 12, 14, 13, 12 };
            var faceWidth = widths[variant % widths.Length];
            var faceHeight = heights[variant % heights.Length];
            var left = (24 - faceWidth) / 2;
            var bottom = 5;

            Fill(pixels, 24, left - 1, bottom + 2, faceWidth + 2, faceHeight - 3, outline);
            Fill(pixels, 24, left, bottom + 1, faceWidth, faceHeight - 1, skin);
            Fill(pixels, 24, left + 1, bottom, faceWidth - 2, 2, outline);
            Fill(pixels, 24, left + 2, bottom + 1, faceWidth - 4, 2, skin);

            if (variant % 4 == 1)
            {
                Set(pixels, 24, left, bottom + 3, outline);
                Set(pixels, 24, left + faceWidth - 1, bottom + 3, outline);
            }
            else if (variant % 4 == 2)
            {
                Fill(pixels, 24, left - 1, bottom + 7, 2, 3, skin);
                Fill(pixels, 24, left + faceWidth - 1, bottom + 7, 2, 3, skin);
            }
            else if (variant % 4 == 3)
            {
                Fill(pixels, 24, left + 2, bottom + 1, faceWidth - 4, 1, outline);
            }
        }

        private static void DrawHair(Color32[] pixels, int variant, Color32 hair, Color32 outline)
        {
            var style = variant % 16;
            if (style == 15)
            {
                Fill(pixels, 24, 6, 17, 12, 2, outline);
                Fill(pixels, 24, 7, 18, 10, 1, hair);
                return;
            }

            Fill(pixels, 24, 4, 17, 16, 4, outline);
            Fill(pixels, 24, 5, 18, 14, 4, hair);
            switch (style)
            {
                case 0:
                    Fill(pixels, 24, 5, 16, 5, 3, hair);
                    break;
                case 1:
                    Fill(pixels, 24, 5, 15, 4, 5, hair);
                    Fill(pixels, 24, 9, 17, 7, 2, hair);
                    break;
                case 2:
                    Fill(pixels, 24, 3, 11, 3, 8, outline);
                    Fill(pixels, 24, 4, 11, 2, 8, hair);
                    Fill(pixels, 24, 18, 11, 3, 8, outline);
                    Fill(pixels, 24, 18, 11, 2, 8, hair);
                    break;
                case 3:
                    Fill(pixels, 24, 3, 6, 3, 13, hair);
                    Fill(pixels, 24, 18, 6, 3, 13, hair);
                    break;
                case 4:
                    Fill(pixels, 24, 4, 16, 4, 2, hair);
                    Fill(pixels, 24, 16, 16, 4, 3, hair);
                    break;
                case 5:
                    Fill(pixels, 24, 5, 15, 6, 4, hair);
                    Fill(pixels, 24, 13, 15, 6, 4, hair);
                    break;
                case 6:
                    Fill(pixels, 24, 9, 21, 6, 3, outline);
                    Fill(pixels, 24, 10, 22, 4, 2, hair);
                    break;
                case 7:
                    Fill(pixels, 24, 19, 11, 4, 7, outline);
                    Fill(pixels, 24, 19, 12, 3, 6, hair);
                    break;
                case 8:
                    Fill(pixels, 24, 3, 14, 4, 5, hair);
                    Fill(pixels, 24, 17, 14, 4, 5, hair);
                    Fill(pixels, 24, 7, 16, 3, 3, hair);
                    Fill(pixels, 24, 14, 16, 3, 3, hair);
                    break;
                case 9:
                    Fill(pixels, 24, 4, 13, 3, 6, outline);
                    Fill(pixels, 24, 5, 15, 2, 4, hair);
                    Fill(pixels, 24, 7, 17, 9, 2, hair);
                    break;
                case 10:
                    Fill(pixels, 24, 5, 15, 14, 4, hair);
                    Set(pixels, 24, 9, 15, outline);
                    Set(pixels, 24, 14, 15, outline);
                    break;
                case 11:
                    Fill(pixels, 24, 4, 13, 3, 6, hair);
                    Fill(pixels, 24, 17, 11, 3, 8, hair);
                    Fill(pixels, 24, 7, 16, 5, 3, hair);
                    break;
                case 12:
                    Fill(pixels, 24, 7, 21, 10, 3, outline);
                    Fill(pixels, 24, 8, 21, 8, 3, hair);
                    break;
                case 13:
                    Fill(pixels, 24, 1, 11, 4, 6, outline);
                    Fill(pixels, 24, 2, 12, 3, 5, hair);
                    Fill(pixels, 24, 19, 11, 4, 6, outline);
                    Fill(pixels, 24, 19, 12, 3, 5, hair);
                    break;
                case 14:
                    Fill(pixels, 24, 5, 15, 11, 4, hair);
                    Fill(pixels, 24, 15, 14, 4, 3, hair);
                    break;
            }
        }

        private static void DrawEyes(Color32[] pixels, int variant, Color32 outline)
        {
            var style = variant % 10;
            var left = style == 3 || style == 8 ? 7 : 6;
            var right = style == 3 || style == 8 ? 15 : 16;
            var y = style == 4 ? 12 : 13;
            if (style == 1 || style == 6)
            {
                Fill(pixels, 24, left, y, 3, 1, outline);
                Fill(pixels, 24, right - 1, y, 3, 1, outline);
            }
            else if (style == 2 || style == 7)
            {
                Set(pixels, 24, left, y, outline);
                Set(pixels, 24, left + 1, y + 1, outline);
                Set(pixels, 24, right, y, outline);
                Set(pixels, 24, right - 1, y + 1, outline);
            }
            else
            {
                Fill(pixels, 24, left, y, 2, style == 5 ? 2 : 1, outline);
                Fill(pixels, 24, right - 1, y, 2, style == 5 ? 2 : 1, outline);
            }

            if (style == 8 || style == 9)
            {
                Set(pixels, 24, left - 1, y + 1, outline);
                Set(pixels, 24, right + 1, y + 1, outline);
            }
        }

        private static void DrawEyebrows(Color32[] pixels, int variant, Color32 hair, Color32 outline)
        {
            var color = variant % 3 == 0 ? outline : hair;
            var y = variant % 4 == 0 ? 16 : 15;
            var length = variant % 4 == 2 ? 2 : 3;
            Fill(pixels, 24, 6, y, length, 1, color);
            Fill(pixels, 24, 15, y, length, 1, color);
            if (variant % 4 == 1)
            {
                Set(pixels, 24, 8, y - 1, color);
                Set(pixels, 24, 15, y - 1, color);
            }
            else if (variant % 4 == 3)
            {
                Set(pixels, 24, 6, y - 1, color);
                Set(pixels, 24, 17, y - 1, color);
            }
        }

        private static void DrawNose(Color32[] pixels, int variant, Color32 shade)
        {
            var style = variant % 8;
            var y = style < 4 ? 10 : 11;
            Set(pixels, 24, 11, y, shade);
            if (style == 1 || style == 5) Set(pixels, 24, 12, y, shade);
            if (style == 2 || style == 6) Set(pixels, 24, 11, y + 1, shade);
            if (style == 3 || style == 7)
            {
                Set(pixels, 24, 12, y, shade);
                Set(pixels, 24, 12, y + 1, shade);
            }
        }

        private static void DrawMouth(Color32[] pixels, int variant, Color32 outline)
        {
            var style = variant % 10;
            var color = style >= 7 ? ToColor("A94D5E") : outline;
            var y = style == 4 ? 7 : 8;
            if (style == 0 || style == 7) Fill(pixels, 24, 10, y, 4, 1, color);
            else if (style == 1 || style == 8) Fill(pixels, 24, 9, y, 6, 1, color);
            else if (style == 2)
            {
                Set(pixels, 24, 10, y + 1, color);
                Fill(pixels, 24, 11, y, 3, 1, color);
            }
            else if (style == 3)
            {
                Fill(pixels, 24, 10, y, 3, 1, color);
                Set(pixels, 24, 13, y + 1, color);
            }
            else if (style == 5 || style == 9)
            {
                Fill(pixels, 24, 10, y, 4, 2, color);
                Fill(pixels, 24, 11, y + 1, 2, 1, ToColor("F3EBD7"));
            }
            else Set(pixels, 24, 12, y, color);
        }

        private static void DrawOutfit(Color32[] pixels, Department department, int variant, Color32 outline, Color32 skin)
        {
            var outfitColors = new[]
            {
                ToColor("4A70A8"), ToColor("168C8B"), ToColor("D6A12C"), ToColor("9B6D9D"),
                ToColor("C84B3C"), ToColor("6D7C8C"), ToColor("3E7852"), ToColor("D17655"),
                ToColor("596A9B"), ToColor("A35C72"), ToColor("4D6972"), ToColor("7C6854")
            };
            var shirt = outfitColors[variant % outfitColors.Length];
            Fill(pixels, 24, 2, 0, 20, 6, outline);
            Fill(pixels, 24, 3, 0, 18, 5, shirt);
            Fill(pixels, 24, 10, 4, 4, 2, skin);
            if (variant % 3 == 0)
            {
                Fill(pixels, 24, 8, 3, 3, 2, ToColor("F3EBD7"));
                Fill(pixels, 24, 13, 3, 3, 2, ToColor("F3EBD7"));
                Fill(pixels, 24, 11, 1, 2, 4, DepartmentColor(department));
            }
            else if (variant % 3 == 1)
            {
                Fill(pixels, 24, 9, 2, 6, 2, DepartmentColor(department));
            }
            else
            {
                Set(pixels, 24, 11, 3, ToColor("F3EBD7"));
                Set(pixels, 24, 12, 3, ToColor("F3EBD7"));
            }
        }

        private static void DrawAccessory(Color32[] pixels, int variant, Color32 hair, Color32 outline, Color32 skin)
        {
            var accent = ToColor("4A70A8");
            switch (variant % 9)
            {
                case 1:
                    Fill(pixels, 24, 5, 12, 6, 3, accent);
                    Fill(pixels, 24, 13, 12, 6, 3, accent);
                    Fill(pixels, 24, 6, 13, 4, 1, skin);
                    Fill(pixels, 24, 14, 13, 4, 1, skin);
                    Fill(pixels, 24, 11, 13, 2, 1, accent);
                    break;
                case 2:
                    Fill(pixels, 24, 5, 12, 6, 3, outline);
                    Fill(pixels, 24, 13, 12, 6, 3, outline);
                    Fill(pixels, 24, 6, 13, 4, 1, skin);
                    Fill(pixels, 24, 14, 13, 4, 1, skin);
                    Fill(pixels, 24, 11, 13, 2, 1, outline);
                    break;
                case 3:
                    Set(pixels, 24, 3, 10, ToColor("D6A12C"));
                    Set(pixels, 24, 20, 10, ToColor("D6A12C"));
                    break;
                case 4:
                    Fill(pixels, 24, 16, 19, 3, 1, ToColor("C84B3C"));
                    Set(pixels, 24, 17, 20, ToColor("C84B3C"));
                    break;
                case 5:
                    Fill(pixels, 24, 2, 11, 2, 7, outline);
                    Fill(pixels, 24, 20, 11, 2, 7, outline);
                    Fill(pixels, 24, 19, 9, 3, 2, outline);
                    Set(pixels, 24, 18, 9, accent);
                    break;
                case 6:
                    Fill(pixels, 24, 17, 5, 4, 3, ToColor("F3EBD7"));
                    Fill(pixels, 24, 18, 6, 2, 1, DepartmentColor(Department.ProjectManagement));
                    break;
                case 7:
                    Fill(pixels, 24, 7, 9, 3, 1, hair);
                    Fill(pixels, 24, 14, 9, 3, 1, hair);
                    break;
                case 8:
                    Fill(pixels, 24, 4, 20, 16, 2, outline);
                    Fill(pixels, 24, 5, 21, 14, 2, ToColor("D6A12C"));
                    break;
            }
        }

        private static Color32 SkinShade(Color32 skin)
        {
            return new Color32(
                (byte)Mathf.Max(0, skin.r - 42),
                (byte)Mathf.Max(0, skin.g - 42),
                (byte)Mathf.Max(0, skin.b - 42),
                255);
        }

        public static Sprite ProjectBoss()
        {
            if (projectBoss != null) return projectBoss;
            var pixels = Canvas(64, 64);
            var outline = ToColor("17364A");
            Fill(pixels, 64, 4, 18, 56, 42, outline);
            Fill(pixels, 64, 7, 21, 50, 36, ToColor("6D7C8C"));
            Fill(pixels, 64, 10, 24, 44, 13, ToColor("9AA6AB"));
            Fill(pixels, 64, 10, 40, 44, 13, ToColor("9AA6AB"));
            Fill(pixels, 64, 25, 31, 14, 3, outline);
            Fill(pixels, 64, 25, 47, 14, 3, outline);
            Fill(pixels, 64, 8, 7, 18, 15, ToColor("F3EBD7"));
            Fill(pixels, 64, 32, 4, 21, 18, ToColor("D6A12C"));
            Fill(pixels, 64, 23, 2, 5, 16, ToColor("168C8B"));
            Fill(pixels, 64, 40, 22, 21, 21, outline);
            Fill(pixels, 64, 42, 24, 17, 17, ToColor("C84B3C"));
            Fill(pixels, 64, 49, 27, 2, 8, ToColor("F3EBD7"));
            Fill(pixels, 64, 49, 33, 6, 2, ToColor("F3EBD7"));
            return projectBoss = Build("ProjectBoss", 64, 64, pixels);
        }

        public static Sprite AttackBlock(Color color)
        {
            var value = (Color32)color;
            var key = value.r + "_" + value.g + "_" + value.b;
            if (AttackBlocks.TryGetValue(key, out var cached)) return cached;
            var pixels = Canvas(8, 8);
            Fill(pixels, 8, 1, 1, 6, 6, ToColor("17364A"));
            Fill(pixels, 8, 2, 2, 4, 4, value);
            return AttackBlocks[key] = Build("Attack_" + key, 8, 8, pixels);
        }

        private static Sprite Build(string name, int width, int height, Color32[] pixels)
        {
            var texture = new Texture2D(width, height, TextureFormat.RGBA32, false)
            {
                name = name,
                filterMode = FilterMode.Point,
                wrapMode = TextureWrapMode.Clamp
            };
            texture.SetPixels32(pixels);
            texture.Apply(false, true);
            var sprite = Sprite.Create(texture, new Rect(0f, 0f, width, height), new Vector2(0.5f, 0.5f), 16f);
            sprite.name = name;
            return sprite;
        }

        private static Color32[] Canvas(int width, int height) { return new Color32[width * height]; }

        private static void Fill(Color32[] pixels, int width, int x, int y, int blockWidth, int blockHeight, Color32 color)
        {
            for (var row = y; row < y + blockHeight; row++)
                for (var column = x; column < x + blockWidth; column++) Set(pixels, width, column, row, color);
        }

        private static void Set(Color32[] pixels, int width, int x, int y, Color32 color)
        {
            if (x < 0 || y < 0 || x >= width || y >= pixels.Length / width) return;
            pixels[y * width + x] = color;
        }

        private static Color32 DepartmentColor(Department department)
        {
            switch (department)
            {
                case Department.ProjectManagement: return ToColor("4A70A8");
                case Department.Sales: return ToColor("D6A12C");
                case Department.Development: return ToColor("168C8B");
                case Department.Finance: return ToColor("6D7C8C");
                default: return ToColor("9B6D9D");
            }
        }

        private static Color32 ToColor(string hex)
        {
            ColorUtility.TryParseHtmlString("#" + hex, out var color);
            return color;
        }
    }
}
