import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

import { OverlayQualityProps, StreamURL } from '../../types';
import { Colors } from '../../constants';


export default function OverlayQuality({
  actions,
  streamURLs,
  isFullscreen,
  selectedQuality,
  showQualityMenu,
  handleQualityChange,
}: OverlayQualityProps) {  

  const selectQuality = (quality: StreamURL) => {
    actions.onQualityChanged(quality);
    handleQualityChange();
  }

  const qualityOptionButtonPadding = isFullscreen ? 8 : 5;
  const selectedQualityHeight = selectedQuality ? selectedQuality.height : 1080;
  const showQualityCondition = showQualityMenu && streamURLs;

  if(showQualityCondition) {
    return (
      <View style={styles.qualityMenu}>
        {streamURLs.map(q => {
          let textColor = "#fff";
          if(q.height === selectedQualityHeight) {
            textColor = Colors.textAccent;
          }

          return (<TouchableOpacity key={q.height} onPress={() => selectQuality(q)} style={{padding: qualityOptionButtonPadding}} activeOpacity={0.7}>
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