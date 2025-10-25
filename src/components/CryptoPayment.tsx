import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Bitcoin, DollarSign, Coins, Zap, QrCode, Smartphone } from 'lucide-react';

interface CryptoPaymentProps {
  amount: number;
  currency: string;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

export const CryptoPayment = ({ amount, currency, onSuccess, onError }: CryptoPaymentProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<'bitcoin' | 'ethereum' | 'usdt' | 'bnb'>('bitcoin');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState(false);
  const { toast } = useToast();

  // Crypto addresses (these would come from your admin settings)
  const cryptoAddresses = {
    bitcoin: '1NqUvkxoUJDdMRRZu3PUjj68Ro9Ki2UEkc',
    ethereum: '0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5',
    usdt: '0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5',
    bnb: '0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5'
  };

  const cryptoInfo = {
    bitcoin: { name: 'Bitcoin', symbol: 'BTC', icon: Bitcoin, color: 'text-orange-500' },
    ethereum: { name: 'Ethereum', symbol: 'ETH', icon: Zap, color: 'text-blue-500' },
    usdt: { name: 'USDT', symbol: 'USDT', icon: DollarSign, color: 'text-green-500' },
    bnb: { name: 'BNB', symbol: 'BNB', icon: Coins, color: 'text-yellow-500' }
  };

  // Generate QR code for the current crypto address
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const currentAddress = cryptoAddresses[selectedCrypto];
        const currentInfo = cryptoInfo[selectedCrypto];
        
        // Create payment URI based on crypto type
        let qrData = currentAddress;
        
        if (selectedCrypto === 'bitcoin') {
          // Bitcoin URI format: bitcoin:address?amount=value
          qrData = `bitcoin:${currentAddress}?amount=${amount}&label=EngineCore Payment`;
        } else if (selectedCrypto === 'ethereum') {
          // Ethereum URI format: ethereum:address@amount
          qrData = `ethereum:${currentAddress}@${amount}`;
        } else if (selectedCrypto === 'usdt') {
          // USDT on Ethereum
          qrData = `ethereum:${currentAddress}@${amount}`;
        } else if (selectedCrypto === 'bnb') {
          // BNB on BSC
          qrData = `binance:${currentAddress}@${amount}`;
        }
        
        const qrCodeUrl = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(qrCodeUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (selectedCrypto) {
      generateQRCode();
    }
  }, [selectedCrypto, amount]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(type);
      toast({
        title: "Copied!",
        description: `${type} address copied to clipboard`,
      });
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    if (!transactionHash.trim()) {
      toast({
        title: "Transaction Hash Required",
        description: "Please enter your transaction hash to confirm payment",
        variant: "destructive",
      });
      return;
    }

    // Simulate payment verification
    const paymentData = {
      method: 'crypto',
      crypto: selectedCrypto,
      amount,
      currency,
      transactionHash,
      address: cryptoAddresses[selectedCrypto],
      timestamp: new Date().toISOString()
    };

    onSuccess(paymentData);
  };

  const currentAddress = cryptoAddresses[selectedCrypto];
  const currentInfo = cryptoInfo[selectedCrypto];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <currentInfo.icon className={`h-5 w-5 ${currentInfo.color}`} />
            Cryptocurrency Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Crypto Selection */}
          <div className="space-y-2">
            <Label>Select Cryptocurrency</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(cryptoInfo).map(([key, info]) => (
                <Button
                  key={key}
                  variant={selectedCrypto === key ? "default" : "outline"}
                  onClick={() => setSelectedCrypto(key as any)}
                  className="flex items-center gap-2"
                >
                  <info.icon className="h-4 w-4" />
                  {info.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Amount */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-2xl font-bold">
                {amount.toFixed(2)} {currency}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ≈ {selectedCrypto.toUpperCase()} (amount will be calculated based on current rates)
              </p>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <Label>Send to {currentInfo.name} Address</Label>
            <div className="flex gap-2">
              <Input
                value={currentAddress}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(currentAddress, currentInfo.name)}
              >
                {copiedAddress === currentInfo.name ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Send the exact amount to this address. Double-check the address before sending.
            </p>
          </div>

          {/* QR Code Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>QR Code for Mobile Payment</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowQRCode(!showQRCode)}
                className="flex items-center gap-2"
              >
                {showQRCode ? (
                  <>
                    <Smartphone className="h-4 w-4" />
                    Hide QR Code
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4" />
                    Show QR Code
                  </>
                )}
              </Button>
            </div>
            
            {showQRCode && qrCodeDataUrl && (
              <div className="flex flex-col items-center space-y-3 p-4 bg-muted rounded-lg">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <img 
                    src={qrCodeDataUrl} 
                    alt={`${currentInfo.name} QR Code`}
                    className="w-48 h-48"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Scan with your {currentInfo.name} wallet</p>
                  <p className="text-xs text-muted-foreground">
                    Open your mobile wallet and scan this QR code to send payment
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(currentAddress, currentInfo.name)}
                  className="flex items-center gap-2"
                >
                  {copiedAddress === currentInfo.name ? (
                    <>
                      <Check className="h-4 w-4" />
                      Address Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Address
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Transaction Hash */}
          <div className="space-y-2">
            <Label htmlFor="transactionHash">Transaction Hash</Label>
            <Input
              id="transactionHash"
              placeholder="Enter your transaction hash here"
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              After sending the payment, enter the transaction hash to confirm your payment.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Send the exact amount in {currentInfo.name}</li>
              <li>• Double-check the wallet address before sending</li>
              <li>• Cryptocurrency transactions are irreversible</li>
              <li>• Your order will be processed after transaction confirmation</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!transactionHash.trim()}
          >
            Confirm Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoPayment;
