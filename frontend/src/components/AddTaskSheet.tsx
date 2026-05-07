import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, Pressable, StyleSheet, Text } from "react-native";

interface AddTaskSheetProps {
  onSubmit: (title: string, description: string) => Promise<void> | void;
  isSubmitting?: boolean;
}

export interface AddTaskSheetHandle {
  expand: () => void;
  close: () => void;
}

const AddTaskSheet = forwardRef<AddTaskSheetHandle, AddTaskSheetProps>(
  ({ onSubmit, isSubmitting = false }, ref) => {
    const bottomSheetRef = useRef<React.ElementRef<typeof BottomSheet>>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const snapPoints = useMemo(() => ["50%", "90%"], []);

    useImperativeHandle(
      ref,
      () => ({
        expand: () => bottomSheetRef.current?.snapToIndex(0),
        close: () => bottomSheetRef.current?.close(),
      }),
      []
    );

    const handleSheetChange = useCallback((index: number) => {
      if (index === -1) {
        Keyboard.dismiss();
        setTitle("");
        setDescription("");
      }
    }, []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleSubmit = async () => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle || isSubmitting) {
        return;
      }

      await onSubmit(trimmedTitle, description.trim());
      // The state will also be cleared by handleSheetChange when the sheet closes
      bottomSheetRef.current?.close();
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.sheetBackground}
        containerStyle={styles.sheetContainer}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>Add a task</Text>
          <BottomSheetTextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#8c8c8c"
            style={styles.input}
            editable={!isSubmitting}
          />
          <BottomSheetTextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor="#8c8c8c"
            style={[styles.input, styles.textArea]}
            multiline
            editable={!isSubmitting}
          />
          <Pressable
            onPress={() => void handleSubmit()}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
              isSubmitting && styles.submitButtonDisabled,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Saving..." : "Save task"}
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

AddTaskSheet.displayName = "AddTaskSheet";

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#1e1e1e",
  },
  sheetContainer: {
    zIndex: 999,
    elevation: 999,
  },
  handleIndicator: {
    backgroundColor: "#7c7c7c",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#ffffff",
    backgroundColor: "#2a2a2a",
    marginBottom: 12,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#d9822b",
  },
  submitButtonPressed: {
    opacity: 0.92,
  },
  submitButtonDisabled: {
    backgroundColor: "#8f6338",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});

export default AddTaskSheet;
