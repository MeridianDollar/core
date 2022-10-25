import React, { useCallback } from "react";
import { Card, Heading, Box, Flex, Button } from "theme-ui";
import { useLiquitySelector } from "@liquity/lib-react";
import { LiquityStoreState } from "@liquity/lib-base";
import { DisabledEditableRow } from "./Editor";
import { useTroveView } from "./context/TroveViewContext";
import { Icon } from "../Icon";
import { COIN } from "../../strings";
import { CollateralRatio } from "./CollateralRatio";

const select = ({ trove, price }: LiquityStoreState) => ({ trove, price });

export const ReadOnlyTrove: React.FC = () => {
  const { dispatchEvent } = useTroveView();
  const handleAdjustTrove = useCallback(() => {
    dispatchEvent("ADJUST_TROVE_PRESSED");
  }, [dispatchEvent]);
  const handleCloseTrove = useCallback(() => {
    dispatchEvent("CLOSE_TROVE_PRESSED");
  }, [dispatchEvent]);

  const { trove, price } = useLiquitySelector(select);

  // console.log("READONLY TROVE", trove.collateral.prettify(4));
  return (
    <Card>
      <Heading>Trove</Heading>
      <Box sx={{ p: [1, 3] }}>
        <Box>
          <DisabledEditableRow
            label="Collateral"
            inputId="trove-collateral"
            amount={trove.collateral.prettify(4)}
            unit="TLOS"
          />

          <DisabledEditableRow
            label="Debt"
            inputId="trove-debt"
            amount={trove.debt.prettify()}
            unit={COIN}
          />

          <CollateralRatio value={trove.collateralRatio(price)} />
        </Box>

        <Flex variant="layout.actions">
          <Button variant="outline" onClick={handleCloseTrove} sx={{ fontSize: "14px" }}>
            Claim Rewards
          </Button>
          <Button variant="outline" onClick={handleCloseTrove} sx={{ fontSize: "14px" }}>
            &nbsp;&nbsp;Close &nbsp;&nbsp;Trove
          </Button>
          <Button onClick={handleAdjustTrove} sx={{ fontSize: "14px" }}>
            &nbsp;&nbsp;<Icon name="pen" size="sm" />
            &nbsp;&nbsp;Adjust&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Button>
        </Flex>
      </Box>
    </Card>
  );
};
