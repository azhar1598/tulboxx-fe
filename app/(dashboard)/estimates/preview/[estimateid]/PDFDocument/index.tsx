import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.5,
  },
  logoSection: {
    marginBottom: 25,
  },
  logo: {
    width: 150,
    height: "auto",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  headerColumn: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  sectionHeader: {
    backgroundColor: "#212529",
    color: "#FFFFFF",
    padding: "6 12",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  headerContent: {
    paddingTop: 8,
    lineHeight: 1.6,
  },
  companyName: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  contentSection: {
    marginBottom: 25,
  },
  contentText: {
    textAlign: "left",
    lineHeight: 1.6,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bullet: {
    width: 15,
    fontWeight: "bold",
  },
  bulletText: {
    flex: 1,
  },
  table: {
    display: "flex",
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    borderLeftWidth: 1,
    borderLeftColor: "#dee2e6",
    borderRightWidth: 1,
    borderRightColor: "#dee2e6",
  },
  tableHeader: {
    backgroundColor: "#f1f3f5",
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
  },
  tableCol: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#dee2e6",
  },
  tableColLast: {
    flex: 1,
    padding: 8,
  },
  tableColHeader: {
    fontWeight: "bold",
    fontSize: 11,
  },
  tableColCenter: {
    textAlign: "center",
  },
  tableColRight: {
    textAlign: "right",
  },
  totalSection: {
    alignItems: "flex-end",
    marginTop: 12,
  },
  totalAmount: {
    backgroundColor: "#212529",
    color: "#FFFFFF",
    padding: "8 16",
    fontSize: 14,
    fontWeight: "bold",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
    paddingTop: 15,
  },
  signatureBox: {
    flex: 1,
    marginHorizontal: 10,
  },
  signatureLabel: {
    fontWeight: "bold",
    marginBottom: 25,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#212529",
    width: 200,
    marginBottom: 6,
  },
  timelineText: {
    marginBottom: 6,
  },
  strongText: {
    fontWeight: "bold",
  },
});

interface PDFDocumentProps {
  estimateData: any;
  aiContent: any;
  userProfile: any;
}

export const EstimatePDFDocument = ({
  estimateData,
  aiContent,
  userProfile,
}: PDFDocumentProps) => {
  const processedDescription = {
    ...aiContent,
    scopeOfWork:
      typeof aiContent?.scopeOfWork === "string"
        ? aiContent?.scopeOfWork
            .split(/\\n|\\r|\n/)
            .filter((item) => item.trim())
            .map((item) => item.replace(/^- /, ""))
        : aiContent?.scopeOfWork,
  };

  const totalAmount =
    estimateData?.lineItems?.reduce((acc, item) => acc + item.totalPrice, 0) ||
    0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo Section */}
        {userProfile?.logo && (
          <View style={styles.logoSection}>
            <Image style={styles.logo} src={userProfile.logo} />
          </View>
        )}

        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerColumn}>
            <Text style={styles.sectionHeader}>PREPARED BY:</Text>
            <View style={styles.headerContent}>
              <Text style={styles.companyName}>
                {userProfile?.companyName || "Company Name"}
              </Text>
              <Text>{userProfile?.address || "Company Address"}</Text>
              <Text>{userProfile?.email || "company@email.com"}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.sectionHeader}>PREPARED FOR:</Text>
            <View style={styles.headerContent}>
              <Text style={styles.companyName}>
                {estimateData?.clients?.name || "Client Name"}
              </Text>
              <Text>{estimateData?.clients?.email || "client@email.com"}</Text>
              <Text>{estimateData?.clients?.address || "Client Address"}</Text>
              <Text>{estimateData?.clients?.phone || "Client Phone"}</Text>
            </View>
          </View>
        </View>

        {/* Project Overview */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeader}>PROJECT OVERVIEW:</Text>
          <Text style={styles.contentText}>
            {processedDescription?.projectOverview ||
              "No project overview available"}
          </Text>
        </View>

        {/* Scope of Work */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeader}>SCOPE OF WORK:</Text>
          {Array.isArray(processedDescription?.scopeOfWork) ? (
            processedDescription.scopeOfWork.map((item, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))
          ) : (
            <Text>No scope of work available</Text>
          )}
        </View>

        {/* Timeline */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeader}>TIMELINE:</Text>
          <Text style={styles.timelineText}>
            <Text style={styles.strongText}>Estimated Project Duration:</Text>{" "}
            {processedDescription?.timeline || "1 Full work day"}
          </Text>
          <Text style={styles.timelineText}>
            <Text style={styles.strongText}>Start Availability:</Text> Can begin
            within 5 business days of approval
          </Text>
          <Text style={styles.timelineText}>
            <Text style={styles.strongText}>Optional:</Text> Add weather buffer
          </Text>
        </View>

        {/* Cost Breakdown */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeader}>COST BREAKDOWN:</Text>

          {/* Table Header */}
          <View style={[styles.table]}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCol, styles.tableColHeader]}>
                DESCRIPTION
              </Text>
              <Text
                style={[
                  styles.tableCol,
                  styles.tableColHeader,
                  styles.tableColCenter,
                ]}
              >
                QUANTITY/UNIT
              </Text>
              <Text
                style={[
                  styles.tableCol,
                  styles.tableColHeader,
                  styles.tableColRight,
                ]}
              >
                UNIT PRICE
              </Text>
              <Text
                style={[
                  styles.tableColLast,
                  styles.tableColHeader,
                  styles.tableColRight,
                ]}
              >
                LINE TOTAL
              </Text>
            </View>

            {/* Table Rows */}
            {estimateData?.lineItems?.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCol}>{item.description}</Text>
                <Text style={[styles.tableCol, styles.tableColCenter]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCol, styles.tableColRight]}>
                  ${item.unitPrice.toFixed(2)}
                </Text>
                <Text style={[styles.tableColLast, styles.tableColRight]}>
                  ${item.totalPrice.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={styles.totalSection}>
            <Text style={styles.totalAmount}>
              TOTAL: ${totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Client Signature</Text>
            <View style={styles.signatureLine} />
            <Text>Date: __________</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Company Representative</Text>
            <View style={styles.signatureLine} />
            <Text>Date: __________</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
