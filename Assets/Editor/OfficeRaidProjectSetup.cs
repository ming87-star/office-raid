#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

namespace OfficeRaid.Editor
{
    [InitializeOnLoad]
    internal static class OfficeRaidProjectSetup
    {
        static OfficeRaidProjectSetup()
        {
            EditorApplication.delayCall += ApplyPortraitSettings;
        }

        [MenuItem("OFFICE RAID/Apply Android Portrait Settings")]
        private static void ApplyPortraitSettings()
        {
            PlayerSettings.defaultInterfaceOrientation = UIOrientation.Portrait;
            PlayerSettings.allowedAutorotateToPortrait = true;
            PlayerSettings.allowedAutorotateToPortraitUpsideDown = false;
            PlayerSettings.allowedAutorotateToLandscapeLeft = false;
            PlayerSettings.allowedAutorotateToLandscapeRight = false;
        }
    }
}
#endif
