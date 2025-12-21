import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity, AuctionStatus } from '../items/item.entity';
import { BidEntity } from '../bids/bid.entity';
import { UserEntity } from '../users/user.entity';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class AuctionService {
    private readonly logger = new Logger(AuctionService.name);

    constructor(
        @InjectRepository(ItemEntity)
        private itemRepo: Repository<ItemEntity>,
        @InjectRepository(BidEntity)
        private bidRepo: Repository<BidEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private mailerService: MailerService,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleAuctionEndings() {
        this.logger.verbose('Checking for ended auctions...');

        const now = new Date();
        const endedItems = await this.itemRepo.find({
            where: {
                status: AuctionStatus.Active,
                endTime: LessThanOrEqual(now),
            },
            relations: ['bids', 'bids.user', 'seller'],
        });

        if (endedItems.length === 0) {
            this.logger.verbose('No ended auctions found.');
            return;
        }

        this.logger.log(`Processing ${endedItems.length} ended auction(s)`);

        for (const item of endedItems) {
            try {
                await this.processAuctionEnd(item);
            } catch (error) {
                this.logger.error(`Failed to process auction ${item.id}:`, error);
            }
        }
    }

    private async processAuctionEnd(item: ItemEntity) {
        let winningBid: BidEntity | null = null;
        if (item.bids.length > 0) {
            winningBid = item.bids.reduce((max, bid) =>
                bid.amount > max.amount ? bid : max
            );
        }

        item.status = AuctionStatus.Ended;
        item.ownerId = winningBid?.userId || null;
        await this.itemRepo.save(item);

        if (winningBid) {
            const winner = winningBid.user;
            await this.sendWinnerEmail(winner, item);
            await this.sendSellerConfirmation(item.seller, item, winner);
        } else {
            await this.sendNoBidEmail(item.seller, item);
        }

        this.logger.log(`Auction ended for item ${item.id}. Winner: ${winningBid?.userId || 'none'}`);
    }

    private async sendWinnerEmail(user: UserEntity, item: ItemEntity) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: ` You won the auction for "${item.title}"!`,
            text: `Congratulations! You won the auction for "${item.title}" with a bid of $${item.currentPrice}.`,
            html: `
        <h2>Congratulations!</h2>
        <p>You won the auction for <strong>"${item.title}"</strong> with a bid of <strong>$${item.currentPrice}</strong>.</p>
        <p>Item ID: ${item.id}</p>
      `,
        });
    }

    private async sendSellerConfirmation(seller: UserEntity, item: ItemEntity, winner: UserEntity) {
        await this.mailerService.sendMail({
            to: seller.email,
            subject: `Auction completed for "${item.title}"`,
            text: `Your auction for "${item.title}" has ended. The winner is ${winner.fullName} (${winner.email}).`,
            html: `
        <h2>Auction Completed</h2>
        <p>Your item <strong>"${item.title}"</strong> has been sold to:</p>
        <p><strong>${winner.fullName}</strong> (${winner.email})</p>
        <p>Winning bid: $${item.currentPrice}</p>
        <p>Item ID: ${item.id}</p>
      `,
        });
    }

    private async sendNoBidEmail(seller: UserEntity, item: ItemEntity) {
        await this.mailerService.sendMail({
            to: seller.email,
            subject: ` Auction ended with no bids for "${item.title}"`,
            text: `Your auction for "${item.title}" has ended with no bids.`,
            html: `
        <h2>Auction Ended</h2>
        <p>Your item <strong>"${item.title}"</strong> did not receive any bids.</p>
        <p>Item ID: ${item.id}</p>
      `,
        });
    }
}