import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { polygon } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Check, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { PAYMENT_TOKENS, CRYPTO_PRICING, CRYPTO_DISCOUNT } from "@/lib/web3-config";

export function CryptoPaymentButton({ tier, interval, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedToken, setSelectedToken] = useState("USDC");
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const basePrice = CRYPTO_PRICING[tier]?.[interval === "month" ? "monthly" : "yearly"];
  const discountedPrice = basePrice ? (basePrice * CRYPTO_DISCOUNT).toFixed(2) : "0";

  const handlePayment = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (chain?.id !== polygon.id) {
      toast.info("Switching to Polygon network...");
      try {
        await switchChain({ chainId: polygon.id });