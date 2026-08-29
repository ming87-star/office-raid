using UnityEngine;

namespace OfficeRaid.Runtime
{
    [DisallowMultipleComponent]
    public sealed class SafeAreaFitter : MonoBehaviour
    {
        private RectTransform rectTransform;
        private Rect lastSafeArea;
        private Vector2Int lastScreenSize;

        private void Awake()
        {
            rectTransform = GetComponent<RectTransform>();
            Apply();
        }

        private void Update()
        {
            var size = new Vector2Int(Screen.width, Screen.height);
            if (Screen.safeArea == lastSafeArea && size == lastScreenSize) return;
            Apply();
        }

        private void Apply()
        {
            var safeArea = Screen.safeArea;
            var width = Mathf.Max(1f, Screen.width);
            var height = Mathf.Max(1f, Screen.height);
            rectTransform.anchorMin = new Vector2(safeArea.xMin / width, safeArea.yMin / height);
            rectTransform.anchorMax = new Vector2(safeArea.xMax / width, safeArea.yMax / height);
            rectTransform.offsetMin = Vector2.zero;
            rectTransform.offsetMax = Vector2.zero;
            lastSafeArea = safeArea;
            lastScreenSize = new Vector2Int(Screen.width, Screen.height);
        }
    }
}
