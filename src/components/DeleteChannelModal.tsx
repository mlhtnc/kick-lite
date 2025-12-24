import React from "react";
import {
	Modal,
	Text,
	StyleSheet,
	Pressable,
} from "react-native";
import { Colors } from "../constants";
import BasicButton from "./buttons/BasicButton";

type Props = {
	visible: boolean;
	onClose: () => void;
  deleteChannel: () => void;
};

export default function DeleteChannelModal({ visible, onClose, deleteChannel }: Props) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable style={styles.modal}>
          <Text style={styles.infoText}>Are you sure you want to delete this channel?</Text>
					<BasicButton
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
            text="DELETE"
            onPress={deleteChannel}
          />
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
  },
	modal: {
    width: "70%",
    height: "25%",
    justifyContent: "center",
		backgroundColor: Colors.card,
		padding: 20,
		borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
	},
  infoText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: Colors.error,
    height: 40,
  },
  deleteButtonText: {
    color: Colors.textPrimary,
    fontSize: 20,
  }
});
