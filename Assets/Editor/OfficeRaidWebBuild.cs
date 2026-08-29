#if UNITY_EDITOR
using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Build.Reporting;

namespace OfficeRaid.Editor
{
    public static class OfficeRaidWebBuild
    {
        private const string OutputPath = "build/WebGL";

        [MenuItem("OFFICE RAID/Build WebGL Preview")]
        public static void BuildWebGL()
        {
            Directory.CreateDirectory(OutputPath);
            PlayerSettings.productName = "OFFICE RAID";
            PlayerSettings.WebGL.template = "PROJECT:OfficeRaid";
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;

            var scenes = EditorBuildSettings.scenes
                .Where(scene => scene.enabled)
                .Select(scene => scene.path)
                .ToArray();
            if (scenes.Length == 0)
            {
                throw new InvalidOperationException("WebGL 빌드에 포함된 Scene이 없습니다.");
            }

            var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
            {
                scenes = scenes,
                locationPathName = OutputPath,
                target = BuildTarget.WebGL,
                options = BuildOptions.None
            });
            if (report.summary.result != BuildResult.Succeeded)
            {
                throw new InvalidOperationException($"WebGL 빌드 실패: {report.summary.result}");
            }
        }
    }
}
#endif
