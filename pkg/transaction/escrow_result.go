package transaction

import (
	pb "github.com/PoC-Consortium/Aspera/pkg/api/p2p"
	"github.com/PoC-Consortium/Aspera/pkg/encoding"
)

const (
	EscrowResultType    = 21
	EscrowResultSubType = 2
)

type EscrowResult struct {
	*pb.EscrowResult
}

func EmptyEscrowResult() *EscrowResult {
	return &EscrowResult{
		EscrowResult: &pb.EscrowResult{
			Attachment: &pb.EscrowResult_Attachment{},
		},
	}
}

func (tx *EscrowResult) WriteAttachmentBytes(e encoding.Encoder) {
	e.WriteUint64(tx.Attachment.Id)
	e.WriteUint8(uint8(tx.Attachment.Decision))
}

func (tx *EscrowResult) AttachmentSizeInBytes() int {
	return 8 + 1
}

func (tx *EscrowResult) GetType() uint16 {
	return EscrowResultSubType<<8 | EscrowResultType
}
