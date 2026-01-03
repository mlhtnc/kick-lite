import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

import { usePlayerStore } from '../../stores/playerStore';
import { OverlayQualityProps, StreamURL } from '../../types';
import { useCurrentStreamStore } from '../../stores/currentStreamStore';
import { Colors } from '../../constants';

export default function OverlayQuality({
  showQualityMenu,
  handleQualityChange,
}: OverlayQualityProps) {

  const streamUrls = useCurrentStreamStore(s => s.streamUrls);
  const selectedQuality = useCurrentStreamStore(s => s.selectedQuality);

  const setSource = usePlayerStore(s => s.setSource);
  const setSelectedQuality = useCurrentStreamStore(s => s.setSelectedQuality);
  const isFullscreen = usePlayerStore(s => s.isFullscreen);

  const selectQuality = (quality: number) => {
    const selectedQuality = streamUrls?.filter(e => e.height === quality)[0];
    setSource(selectedQuality ? selectedQuality.url : "");
    setSelectedQuality(quality);
    handleQualityChange();
  }

  const qualityOptionButtonPadding = isFullscreen() ? 8 : 5;
  const showQualityCondition = showQualityMenu && streamUrls && selectedQuality;

  if(showQualityCondition) {
    return (
      <View style={styles.qualityMenu}>
        {streamUrls.map(q => {
          let textColor = "#fff";
          if(q.height === selectedQuality) {
            textColor = Colors.textAccent;
          }

          return (<TouchableOpacity key={q.height} onPress={() => selectQuality(q.height)} style={{padding: qualityOptionButtonPadding}} activeOpacity={0.7}>
                    <Text style={{color: textColor, fontWeight: "bold"}}>{q.height + "p"}</Text>
                  </TouchableOpacity>)
        })}
      </View>
    )
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  qualityMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 5,
    padding: 5,
  }
});