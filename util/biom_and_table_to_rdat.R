# Usage: Rscript biom_and_table_to_rdat.R community.biom pseudotax.tsv out.Rdata

library(phyloseq)

args <- commandArgs(trailingOnly = TRUE)

b = import_biom(args[1])
t = as.matrix(read.table(args[2], header=T, row.names=1, sep="\t"))
tax_table(b) = t
save(b, file=args[3])
