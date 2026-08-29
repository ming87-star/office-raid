using System.Collections.Generic;
using OfficeRaid.Core;
using UnityEngine;

namespace OfficeRaid.Runtime
{
    internal static class PixelArtFactory
    {
        private static readonly Dictionary<Department, Sprite> Employees = new Dictionary<Department, Sprite>();
        private static readonly Dictionary<string, Sprite> Portraits = new Dictionary<string, Sprite>();
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
            Fill(pixels, 24, 5, 2, 13, 5, hair);
            Fill(pixels, 24, 4, 6, 15, 7, outline);
            Fill(pixels, 24, 6, 7, 11, 6, skin);
            Fill(pixels, 24, 7, 12, 9, 2, hair);
            Fill(pixels, 24, 5, 14, 13, 10, outline);
            Fill(pixels, 24, 6, 15, 11, 8, shirt);
            Fill(pixels, 24, 2, 16, 4, 7, skin);
            Fill(pixels, 24, 18, 16, 4, 7, skin);
            Fill(pixels, 24, 6, 24, 5, 7, outline);
            Fill(pixels, 24, 13, 24, 5, 7, outline);
            return Employees[department] = Build("Employee_" + department, 24, 32, pixels);
        }

        public static Sprite Portrait(Department department, AppearanceProfile appearance)
        {
            var key = department + "_" + appearance.Skin + "_" + appearance.Hair + "_" + appearance.Eyes + "_" + appearance.Accessory;
            if (Portraits.TryGetValue(key, out var cached)) return cached;
            var pixels = Canvas(24, 24);
            var outline = ToColor("17364A");
            var skinColors = new[] { ToColor("F0C6A5"), ToColor("D99D78"), ToColor("A96F50"), ToColor("754A39") };
            var hairColors = new[] { ToColor("352F31"), ToColor("6D4935"), ToColor("B67A36"), ToColor("24384A") };
            var skin = skinColors[appearance.Skin % skinColors.Length];
            var hair = hairColors[appearance.Hair % hairColors.Length];
            Fill(pixels, 24, 4, 1, 16, 6, hair);
            Fill(pixels, 24, 3, 5, 18, 14, outline);
            Fill(pixels, 24, 4, 5, 16, 13, skin);
            Fill(pixels, 24, 5, 4, 14, 3, hair);
            Fill(pixels, 24, 7, 10, 3, 2, outline);
            Fill(pixels, 24, 14, 10, 3, 2, outline);
            Set(pixels, 24, 11, 13, outline);
            Fill(pixels, 24, 9, 16, 6, 1, outline);
            Fill(pixels, 24, 2, 19, 20, 5, DepartmentColor(department));
            if (appearance.Accessory % 3 == 1)
            {
                Fill(pixels, 24, 6, 9, 5, 1, ToColor("4A70A8"));
                Fill(pixels, 24, 13, 9, 5, 1, ToColor("4A70A8"));
                Fill(pixels, 24, 11, 9, 2, 1, ToColor("4A70A8"));
            }
            return Portraits[key] = Build("Portrait_" + key, 24, 24, pixels);
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
