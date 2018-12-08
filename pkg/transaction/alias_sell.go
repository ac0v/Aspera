package transaction

import (
	pb "github.com/PoC-Consortium/Aspera/pkg/api/p2p"
	"github.com/PoC-Consortium/Aspera/pkg/encoding"
)

const (
	AliasSellType    = 1
	AliasSellSubType = 6
)

type AliasSell struct {
	*pb.AliasSell
}

func EmptyAliasSell() *AliasSell {
	return &AliasSell{
		AliasSell: &pb.AliasSell{
			Attachment: &pb.AliasSell_Attachment{},
		},
	}
}

func (tx *AliasSell) WriteAttachmentBytes(e encoding.Encoder) {
	e.WriteUint8(uint8(len(tx.Attachment.Name)))
	e.WriteBytes(tx.Attachment.Name)
	e.WriteInt64(tx.Attachment.Price)
}

func (tx *AliasSell) AttachmentSizeInBytes() int {
	return 1 + len(tx.Attachment.Name) + 8
}

func (tx *AliasSell) GetType() uint16 {
	return AliasSellSubType<<8 | AliasSellType
}
