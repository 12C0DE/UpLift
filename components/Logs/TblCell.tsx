import { LogsStyles as styles } from "@/assets";
import { Text, View } from "react-native";

interface CellProps {
  children: React.ReactNode;
  width: number;
  align?: "left" | "center" | "right";
  header?: boolean;
  section?: boolean;
  bold?: boolean;
  small?: boolean;
  weightValue?: boolean;
}

export const TblCell = ({
  children,
  width,
  align = "left",
  header,
  section,
  bold,
  small,
  weightValue,
}: CellProps) => {
  return (
    <View
      style={[
        styles.cell,
        header && styles.headerCell,
        section && styles.sectionCell,
        { width },
      ]}
    >
      <Text
        style={[
          styles.cellText,
          header && styles.headerText,
          section && styles.sectionText,
          bold && styles.boldText,
          small && styles.smallText,
          weightValue && styles.weightValueText,
          { textAlign: align },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};
